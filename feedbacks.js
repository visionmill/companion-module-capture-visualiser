module.exports = {
	getFeedbacks(instance) {
		return {
			liveViewActive: {
				type: 'boolean',
				name: 'Any live view active',
				description: 'True if any view is live (index >= 0)',
				defaultStyle: {
					bgcolor: '#00FF00',
					color: '#000000',
				},
				options: [],
				callback: () => instance.viewStatus.index >= 0,
			},

			viewIndexMatch: {
				type: 'boolean',
				name: 'Specific view live',
				description: 'Active when a specific view index (0/1/2) is live',
				defaultStyle: {
					bgcolor: '#00FF00',
					color: '#000000',
				},
				options: [
					{
						type: 'dropdown',
						id: 'view',
						label: 'View index',
						default: '0',
						choices: [
							{ id: '0', label: 'Alpha (0)' },
							{ id: '1', label: 'Beta (1)' },
							{ id: '2', label: 'Gamma (2)' },
						],
					},
				],
				callback: (fb) =>
					instance.viewStatus.index === parseInt(fb.options.view, 10),
			},
		}
	},
}