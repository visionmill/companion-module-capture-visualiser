module.exports = {
	getVariables(instance) {
		const vars = [
			{ variableId: 'product_name', name: 'Product Name' },
			{ variableId: 'product_version', name: 'Product Version' },
			{ variableId: 'catalog_count', name: 'Catalog Count' },
			{ variableId: 'live_view_index', name: 'Live View Index' },
			{ variableId: 'camera_x', name: 'Camera X' },
			{ variableId: 'camera_y', name: 'Camera Y' },
			{ variableId: 'camera_z', name: 'Camera Z' },
			{ variableId: 'focus_x', name: 'Focus X' },
			{ variableId: 'focus_y', name: 'Focus Y' },
			{ variableId: 'focus_z', name: 'Focus Z' },
		]

		// Add all dynamic catalog / position vars
		for (const c of instance.catalogs || []) {
			vars.push({
				variableId: `catalog_${c}_name`,
				name: `Catalog ${c} Name`,
			})

			const positions = instance.catalogPositions[c] || []
			for (const p of positions) {
				vars.push({
					variableId: `catalog_${c}_pos_${p}_name`,
					name: `Catalog ${c} Position ${p} Name`,
				})
			}
		}

		return vars
	},

	updateVariables(instance) {
		const values = {
			product_name: instance.productName || 'Unknown',
			product_version: instance.productVersion || 'Unknown',
			catalog_count: instance.catalogs?.length || 0,
			live_view_index: instance.viewStatus.index,
			camera_x: instance.viewStatus.cameraX,
			camera_y: instance.viewStatus.cameraY,
			camera_z: instance.viewStatus.cameraZ,
			focus_x: instance.viewStatus.focusX,
			focus_y: instance.viewStatus.focusY,
			focus_z: instance.viewStatus.focusZ,
		}

		// Dynamic variables
		for (const c of instance.catalogs || []) {
			values[`catalog_${c}_name`] = instance.catalogNames[c] || ''

			const positions = instance.catalogPositions[c] || []
			for (const p of positions) {
				const key = `${c}-${p}`
				values[`catalog_${c}_pos_${p}_name`] = instance.positionNames[key] || ''
			}
		}

		instance.setVariableValues(values)
	},
}