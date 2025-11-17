const { InstanceBase, Regex, runEntrypoint } = require('@companion-module/base')
const osc = require('osc')

const actions = require('./actions')
const feedbacks = require('./feedbacks')
const variables = require('./variables')
const presets = require('./presets')

/**
 * Companion module for Capture Visualiser OSC control
 * Supports camera positions, view properties, and real-time status monitoring
 */
class CaptureVisualiserInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// OSC connection
		this.oscPort = null

		// Catalog and position data (dynamically discovered from Capture)
		this.catalogs = []
		this.catalogNames = {}
		this.catalogPositions = {}
		this.positionNames = {}

		// Current view status
		this.viewStatus = {
			index: -1,
			cameraX: 0,
			cameraY: 0,
			cameraZ: 0,
			focusX: 0,
			focusY: 0,
			focusZ: 0,
		}

		// Polling timers
		this.pingInterval = null
		this.statusInterval = null
		this.catalogInterval = null
	}

	async init(config) {
		this.config = config
		this.updateStatus('connecting')

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.initOSC()
		this.startTimers()
	}

	async destroy() {
		// Clean up timers
		if (this.pingInterval) clearInterval(this.pingInterval)
		if (this.statusInterval) clearInterval(this.statusInterval)
		if (this.catalogInterval) clearInterval(this.catalogInterval)

		// Close OSC connection
		if (this.oscPort) {
			this.oscPort.close()
			this.oscPort = null
		}
	}

	async configUpdated(config) {
		this.config = config
		this.initOSC()
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				default: '127.0.0.1',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'number',
				id: 'port',
				label: 'OSC Port',
				default: 4004,
				width: 6,
				min: 1,
				max: 65535,
			},
		]
	}

	// ==================== OSC SETUP ====================

	initOSC() {
		if (this.oscPort) {
			this.oscPort.close()
		}

		const host = this.config.host || '127.0.0.1'
		const port = parseInt(this.config.port, 10) || 4004

		// Use metadata: true to properly distinguish int32 from float32
		this.oscPort = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort: 0,
			remoteAddress: host,
			remotePort: port,
			metadata: true,
		})

		this.oscPort.on('ready', () => {
			this.updateStatus('ok')
			this.log('info', `Connected to ${host}:${port}`)
			this.sendOSC('/ping')
			this.refreshCatalogs()
		})

		this.oscPort.on('message', (msg) => {
			this.handleOSCMessage(msg)
		})

		this.oscPort.on('error', (e) => {
			this.updateStatus('connection_failure', e.message)
			this.log('error', `OSC error: ${e}`)
		})

		this.oscPort.open()
	}

	/**
	 * Send OSC message with automatic type conversion
	 * @param {string} address - OSC address (e.g. '/view/live/bloom')
	 * @param {Array} args - Array of arguments (can be plain values or pre-typed objects)
	 */
	sendOSC(address, args = []) {
		if (!this.oscPort) {
			this.log('warn', 'sendOSC called but oscPort is null!')
			return
		}

		// Convert plain JavaScript values to typed OSC arguments
		const typedArgs = args.map((arg) => {
			// If already typed, pass through
			if (typeof arg === 'object' && arg.type) {
				return arg
			}
			// Number: distinguish int32 from float32
			if (typeof arg === 'number') {
				if (Number.isInteger(arg)) {
					return { type: 'i', value: arg }
				} else {
					return { type: 'f', value: arg }
				}
			}
			// Boolean
			if (typeof arg === 'boolean') {
				return { type: arg ? 'T' : 'F' }
			}
			// String
			if (typeof arg === 'string') {
				return { type: 's', value: arg }
			}
			// Fallback
			return arg
		})

		try {
			this.oscPort.send({ address, args: typedArgs })
		} catch (error) {
			this.log('error', `OSC send failed for ${address}: ${error.message}`)
		}
	}

	// ==================== POLLING ====================

	startTimers() {
		// Ping every 5 seconds to keep connection alive
		this.pingInterval = setInterval(() => this.sendOSC('/ping'), 5000)

		// Poll view status every 700ms for real-time updates
		this.statusInterval = setInterval(() => this.sendOSC('/view/live/getStatus'), 700)

		// Refresh catalog list every 15 seconds
		this.catalogInterval = setInterval(() => this.refreshCatalogs(), 15000)
	}

	ping() {
		this.sendOSC('/ping')
	}

	refreshCatalogs() {
		this.sendOSC('/getCatalogs')
	}

	getViewStatus() {
		this.sendOSC('/view/live/getStatus')
	}

	// ==================== OSC MESSAGE HANDLING ====================

	handleOSCMessage(msg) {
		const a = msg.address

		// With metadata: true, extract values from typed objects
		const args = (msg.args || []).map((arg) => {
			if (typeof arg === 'object' && 'value' in arg) {
				return arg.value
			}
			// Boolean types (T/F have no value property)
			if (typeof arg === 'object' && arg.type === 'T') {
				return true
			}
			if (typeof arg === 'object' && arg.type === 'F') {
				return false
			}
			return arg
		})

		// Handle pong response
		if (a === '/pong') {
			this.setVariableValues({
				product_name: args[0] || 'Unknown',
				product_version: args[1] || 'Unknown',
			})
		}

		// Handle catalog list
		else if (a === '/catalogs') {
			this.catalogs = args.map((n) => parseInt(n, 10)).filter((n) => !isNaN(n))
			this.setVariableValues({ catalog_count: this.catalogs.length })

			// Request names and positions for each catalog
			for (const c of this.catalogs) {
				this.sendOSC(`/catalog/${c}/getName`)
				this.sendOSC(`/catalog/${c}/getPositions`)
			}
		}

		// Handle catalog name
		else if (/^\/catalog\/\d+\/name$/.test(a)) {
			const c = parseInt(a.split('/')[2])
			this.catalogNames[c] = args[0] || `Catalog ${c}`
			this.updateDynamicVariables()
		}

		// Handle catalog positions
		else if (/^\/catalog\/\d+\/positions$/.test(a)) {
			const c = parseInt(a.split('/')[2])
			this.catalogPositions[c] = args.map((n) => parseInt(n, 10)).filter((n) => !isNaN(n))

			// Request names for each position
			for (const p of this.catalogPositions[c]) {
				this.sendOSC(`/catalog/${c}/position/${p}/getName`)
			}

			this.updateDynamicVariables()
		}

		// Handle position name
		else if (/^\/catalog\/\d+\/position\/\d+\/name$/.test(a)) {
			const parts = a.split('/')
			const c = parseInt(parts[2])
			const p = parseInt(parts[4])
			this.positionNames[`${c}-${p}`] = args[0] || `Position ${p}`

			this.updateDynamicVariables()
		}

		// Handle view status
		else if (a === '/view/live/status') {
			const [index, cx, cy, cz, fx, fy, fz] = args
			this.viewStatus = {
				index: index ?? -1,
				cameraX: cx ?? 0,
				cameraY: cy ?? 0,
				cameraZ: cz ?? 0,
				focusX: fx ?? 0,
				focusY: fy ?? 0,
				focusZ: fz ?? 0,
			}

			this.setVariableValues({
				live_view_index: this.viewStatus.index,
				camera_x: this.viewStatus.cameraX.toFixed(2),
				camera_y: this.viewStatus.cameraY.toFixed(2),
				camera_z: this.viewStatus.cameraZ.toFixed(2),
				focus_x: this.viewStatus.focusX.toFixed(2),
				focus_y: this.viewStatus.focusY.toFixed(2),
				focus_z: this.viewStatus.focusZ.toFixed(2),
			})

			this.checkFeedbacks('liveViewActive', 'viewIndexMatch')
		}
	}

	/**
	 * Update dynamic variables and presets when catalog data changes
	 */
	updateDynamicVariables() {
		this.setVariableDefinitions(variables.getVariables(this))
		variables.updateVariables(this)
		this.setPresetDefinitions(presets.getPresets(this))
	}

	// ==================== ACTION HELPERS ====================

	/**
	 * Change camera position with optional transition parameters
	 * @param {string} view - View identifier ('live', '0', '1', '2')
	 * @param {number} catalog - Catalog number (1-255)
	 * @param {number} position - Position number (1-255)
	 * @param {number} time - Transition time in seconds (0-600)
	 * @param {number} damp - Dampening factor (0-1)
	 * @param {number} curve - Curvature factor (0-1)
	 */
	setViewPosition(view, catalog, position, time, damp, curve) {
		// Start with required parameters (must be int32)
		const args = [
			{ type: 'i', value: parseInt(catalog) },
			{ type: 'i', value: parseInt(position) },
		]

		const timeVal = Number(time) || 0
		const dampVal = Number(damp) || 0
		const curveVal = Number(curve) || 0

		// Optional parameters (must be float32)
		// Note: If you want dampening, you MUST include time
		//       If you want curvature, you MUST include time AND dampening
		if (timeVal > 0 || dampVal > 0 || curveVal > 0) {
			args.push({ type: 'f', value: timeVal })

			if (dampVal > 0 || curveVal > 0) {
				args.push({ type: 'f', value: dampVal })

				if (curveVal > 0) {
					args.push({ type: 'f', value: curveVal })
				}
			}
		}

		this.sendOSC(`/view/${view}/position`, args)
	}

	/**
	 * Set a float property (always sends as float32, never int32)
	 */
	setFloat(view, property, value) {
		// Explicitly type as float to prevent 0 and 1 from being sent as integers
		const args = [{ type: 'f', value: Number(value) }]
		this.sendOSC(`/view/${view}/${property}`, args)
	}

	/**
	 * Set a boolean property
	 */
	setBool(view, property, value) {
		const args = [Boolean(value)]
		this.sendOSC(`/view/${view}/${property}`, args)
	}

	// ==================== COMPANION API ====================

	initActions() {
		this.setActionDefinitions(actions.getActions(this))
	}

	initFeedbacks() {
		this.setFeedbackDefinitions(feedbacks.getFeedbacks(this))
	}

	initVariables() {
		this.setVariableDefinitions(variables.getVariables(this))
		variables.updateVariables(this)
	}

	initPresets() {
		this.setPresetDefinitions(presets.getPresets(this))
	}
}

runEntrypoint(CaptureVisualiserInstance)
