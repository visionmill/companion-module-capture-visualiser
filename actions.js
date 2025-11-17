module.exports = {
	getActions(instance) {
		const viewChoices = [
			{ id: 'live', label: 'Live' },
			{ id: '0', label: 'Alpha (0)' },
			{ id: '1', label: 'Beta (1)' },
			{ id: '2', label: 'Gamma (2)' },
		]

		// Helper function to create percentage-based lighting actions
		const createPercentageAction = (name, property, defaultVal) => ({
			name: `Set ${name} (%)`,
			options: [
				{ type: 'dropdown', id: 'view', label: 'View', default: 'live', choices: viewChoices },
				{
					type: 'number',
					id: 'val',
					label: 'Level (%)',
					min: 0,
					max: 100,
					step: 1,
					default: defaultVal,
				},
			],
			callback: (action) => {
				const v = Number(action.options.val) / 100.0
				instance.setFloat(action.options.view, property, v)
			},
		})

		return {
			// System actions
			ping: {
				name: 'Ping Capture',
				callback: () => instance.ping(),
			},

			refreshCatalogs: {
				name: 'Refresh catalogs',
				callback: () => instance.refreshCatalogs(),
			},

			getViewStatus: {
				name: 'Get live view status',
				callback: () => instance.getViewStatus(),
			},

			// Lighting actions (percentage-based)
			ambientLighting: createPercentageAction('Ambient Lighting', 'ambientLighting', 50),
			fillLighting: createPercentageAction('Fill Lighting', 'fillLighting', 50),
			hueClamp: createPercentageAction('Hue Clamp', 'hueClamp', 50),
			bloom: createPercentageAction('Bloom', 'bloom', 30),

			// Exposure adjustment
			exposureAdjustment: {
				name: 'Set Exposure Adjustment (-3EV to 3EV)',
				options: [
					{ type: 'dropdown', id: 'view', label: 'View', default: 'live', choices: viewChoices },
					{
						type: 'number',
						id: 'val',
						label: 'Adjustment (-3EV to 3EV)',
						min: -3,
						max: 3,
						step: 0.1,
						default: 0,
					},
				],
				callback: (action) =>
					instance.setFloat(action.options.view, 'exposureAdjustment', action.options.val),
			},

			// White balance
			whiteBalance: {
				name: 'Set White Balance (2500–10000K)',
				options: [
					{ type: 'dropdown', id: 'view', label: 'View', default: 'live', choices: viewChoices },
					{
						type: 'number',
						id: 'val',
						label: 'Temperature K',
						min: 2500,
						max: 10000,
						step: 50,
						default: 6500,
					},
				],
				callback: (action) =>
					instance.setFloat(action.options.view, 'whiteBalance', action.options.val),
			},

			// Boolean toggles
			automaticExposureOnOff: {
				name: 'Set Automatic Exposure Yes/No',
				options: [
					{ type: 'dropdown', id: 'view', label: 'View', default: 'live', choices: viewChoices },
					{
						type: 'dropdown',
						id: 'enabled',
						label: 'Mode',
						default: 'yes',
						choices: [
							{ id: 'yes', label: 'Yes' },
							{ id: 'no', label: 'No' },
						],
					},
				],
				callback: (action) =>
					instance.setBool(action.options.view, 'automaticExposure', action.options.enabled === 'yes'),
			},

			laserFlickerOnOff: {
				name: 'Set Laser Flicker Yes/No',
				options: [
					{ type: 'dropdown', id: 'view', label: 'View', default: 'live', choices: viewChoices },
					{
						type: 'dropdown',
						id: 'enabled',
						label: 'Mode',
						default: 'no',
						choices: [
							{ id: 'yes', label: 'Yes' },
							{ id: 'no', label: 'No' },
						],
					},
				],
				callback: (action) =>
					instance.setBool(action.options.view, 'laserFlickerEffect', action.options.enabled === 'yes'),
			},

			// Camera position control
			viewPosition: {
				name: 'Change Camera Position',
				options: [
					{ type: 'dropdown', id: 'view', label: 'View', default: 'live', choices: viewChoices },
					{
						type: 'number',
						id: 'catalog',
						label: 'Catalog (1–255)',
						min: 1,
						max: 255,
						default: 1,
					},
					{
						type: 'number',
						id: 'position',
						label: 'Position (1–255)',
						min: 1,
						max: 255,
						default: 1,
					},
					{
						type: 'number',
						id: 'time',
						label: 'Time (0–600 seconds)',
						min: 0,
						max: 600,
						step: 0.1,
						default: 0,
					},
					{
						type: 'number',
						id: 'damp',
						label: 'Dampening (%)',
						min: 0,
						max: 100,
						step: 1,
						default: 0,
					},
					{
						type: 'number',
						id: 'curve',
						label: 'Curvature (%)',
						min: 0,
						max: 100,
						step: 1,
						default: 0,
					},
				],
				callback: (action) => {
					const o = action.options
					// Convert percentages to 0-1 range
					const dampVal = Number(o.damp) / 100.0
					const curveVal = Number(o.curve) / 100.0
					instance.setViewPosition(o.view, o.catalog, o.position, o.time, dampVal, curveVal)
				},
			},
		}
	},
}
