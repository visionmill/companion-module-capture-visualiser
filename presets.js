module.exports = {
	getPresets(instance) {
		const presets = {}

		// ===========================
		// Camera positions (all catalogs dynamically)
		// ===========================
		for (const c of instance.catalogs || []) {
		const catNameVar = `$(capture:catalog_${c}_name)` // dynamic catalog name
		const positions = instance.catalogPositions[c] || []

		for (const p of positions) {
			const posNameVar = `$(capture:catalog_${c}_pos_${p}_name)`
			const presetId = `cam_c${c}_p${p}`

		presets[presetId] = {
			type: 'button',
			category: `Camera Catalog ${c}`,
			name: `Catalog ${c} Pos ${p}`,
			style: {
				text: `${catNameVar}\n${posNameVar}`,
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#000000',
			},
			steps: [
				{
					down: [
						{
							actionId: 'viewPosition',
							options: {
								view: 'live',
								catalog: c,
								position: p,
								time: 2,
								damp: 50,
								curve: 50,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}
}

		// ===========================
		// Lighting presets (ambient, fill, hue, bloom, exposure)
		// ===========================
		// Ambient 0/50/100% (using ambientLighting action which converts to 0–1)
		presets['ambient_0'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Ambient 0%',
			style: {
				text: 'Ambient\n0%',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#000000',
			},
			steps: [
				{
					down: [
						{
							actionId: 'ambientLighting',
							options: { view: 'live', val: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['ambient_50'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Ambient 50%',
			style: {
				text: 'Ambient\n50%',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#444444',
			},
			steps: [
				{
					down: [
						{
							actionId: 'ambientLighting',
							options: { view: 'live', val: 50 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['ambient_100'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Ambient 100%',
			style: {
				text: 'Ambient\n100%',
				size: '14',
				color: '#000000',
				bgcolor: '#FFFFFF',
			},
			steps: [
				{
					down: [
						{
							actionId: 'ambientLighting',
							options: { view: 'live', val: 100 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		// Fill lighting 0/50/100
		presets['fill_0'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Fill 0%',
			style: {
				text: 'Fill\n0%',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#111111',
			},
			steps: [
				{
					down: [
						{
							actionId: 'fillLighting',
							options: { view: 'live', val: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['fill_50'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Fill 50%',
			style: {
				text: 'Fill\n50%',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#555555',
			},
			steps: [
				{
					down: [
						{
							actionId: 'fillLighting',
							options: { view: 'live', val: 0.5 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['fill_100'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Fill 100%',
			style: {
				text: 'Fill\n100%',
				size: '14',
				color: '#000000',
				bgcolor: '#AAAAAA',
			},
			steps: [
				{
					down: [
						{
							actionId: 'fillLighting',
							options: { view: 'live', val: 1 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		// Hue Clamp 0/50/100
		presets['hue_0'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Hue Clamp 0%',
			style: {
				text: 'Hue\n0%',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#220022',
			},
			steps: [
				{
					down: [
						{
							actionId: 'hueClamp',
							options: { view: 'live', val: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['hue_50'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Hue Clamp 50%',
			style: {
				text: 'Hue\n50%',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#663366',
			},
			steps: [
				{
					down: [
						{
							actionId: 'hueClamp',
							options: { view: 'live', val: 0.5 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['hue_100'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Hue Clamp 100%',
			style: {
				text: 'Hue\n100%',
				size: '14',
				color: '#000000',
				bgcolor: '#CC88CC',
			},
			steps: [
				{
					down: [
						{
							actionId: 'hueClamp',
							options: { view: 'live', val: 1 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		// Bloom presets
		presets['bloom_0'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Bloom 0%',
			style: {
				text: 'Bloom\n0%',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#000000',
			},
			steps: [
				{
					down: [
						{
							actionId: 'bloom',
							options: { view: 'live', val: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['bloom_30'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Bloom 30%',
			style: {
				text: 'Bloom\n30%',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#333333',
			},
			steps: [
				{
					down: [
						{
							actionId: 'bloom',
							options: { view: 'live', val: 0.3 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['bloom_50'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Bloom 50%',
			style: {
				text: 'Bloom\n50%',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#555555',
			},
			steps: [
				{
					down: [
						{
							actionId: 'bloom',
							options: { view: 'live', val: 0.5 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['bloom_80'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Bloom 80%',
			style: {
				text: 'Bloom\n80%',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#884400',
			},
			steps: [
				{
					down: [
						{
							actionId: 'bloom',
							options: { view: 'live', val: 0.8 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		// Exposure: auto on/off
		presets['auto_exposure_on'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Auto Exposure YES',
			style: {
				text: 'Auto\nExposure\nYES',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#008000',
			},
			steps: [
				{
					down: [
						{
							actionId: 'automaticExposureOnOff',
							options: { view: 'live', enabled: 'yes' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['auto_exposure_off'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Auto Exposure NO',
			style: {
				text: 'Auto\nExposure\nNO',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#800000',
			},
			steps: [
				{
					down: [
						{
							actionId: 'automaticExposureOnOff',
							options: { view: 'live', enabled: 'no' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		// Exposure adjustment
		presets['exposure_minus_3'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Exposure -3EV',
			style: {
				text: 'Exposure\n-3EV',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#000000',
			},
			steps: [
				{
					down: [
						{
							actionId: 'exposureAdjustment',
							options: { view: 'live', val: -3 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['exposure_0'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Exposure 0EV',
			style: {
				text: 'Exposure\n0EV',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#444444',
			},
			steps: [
				{
					down: [
						{
							actionId: 'exposureAdjustment',
							options: { view: 'live', val: 0 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['exposure_plus_3'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Exposure +3EV',
			style: {
				text: 'Exposure\n+3EV',
				size: '14',
				color: '#000000',
				bgcolor: '#FFFFFF',
			},
			steps: [
				{
					down: [
						{
							actionId: 'exposureAdjustment',
							options: { view: 'live', val: 3 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		// Laser flicker
		presets['laser_on'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Laser Flicker YES',
			style: {
				text: 'Laser\nFlicker\nYES',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#006488',
			},
			steps: [
				{
					down: [
						{
							actionId: 'laserFlickerOnOff',
							options: { view: 'live', enabled: 'yes' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['laser_off'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Laser Flicker NO',
			style: {
				text: 'Laser\nFlicker\nNO',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#333333',
			},
			steps: [
				{
					down: [
						{
							actionId: 'laserFlickerOnOff',
							options: { view: 'live', enabled: 'no' },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		// White balance
		presets['wb_tungsten'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Tungsten 3200K',
			style: {
				text: 'WB\nTungsten\n3200K',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#663300',
			},
			steps: [
				{
					down: [
						{
							actionId: 'whiteBalance',
							options: { view: 'live', val: 3200 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['wb_daylight'] = {
			type: 'button',
			category: 'Lighting',
			name: 'Daylight 6500K',
			style: {
				text: 'WB\nDaylight\n6500K',
				size: '14',
				color: '#000000',
				bgcolor: '#FFFFCC',
			},
			steps: [
				{
					down: [
						{
							actionId: 'whiteBalance',
							options: { view: 'live', val: 6500 },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		// System / debug
		presets['ping'] = {
			type: 'button',
			category: 'System',
			name: 'Ping',
			style: {
				text: 'PING',
				size: '18',
				color: '#FFFFFF',
				bgcolor: '#006400',
			},
			steps: [
				{
					down: [
						{
							actionId: 'ping',
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['get_status'] = {
			type: 'button',
			category: 'System',
			name: 'Get Status',
			style: {
				text: 'Get\nStatus',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#000064',
			},
			steps: [
				{
					down: [
						{
							actionId: 'getViewStatus',
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['refresh_catalogs'] = {
			type: 'button',
			category: 'System',
			name: 'Refresh Catalogs',
			style: {
				text: 'Refresh\nCatalogs',
				size: '14',
				color: '#FFFFFF',
				bgcolor: '#444400',
			},
			steps: [
				{
					down: [
						{
							actionId: 'refreshCatalogs',
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		return presets
	},
}