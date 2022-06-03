function hasAllPrograms(ns, programs) {
	for(let p of programs) {
		if(!ns.fileExists(p, "home")) {
			return false;
		}
	}

	return true;
}


/** @param {NS} ns */
export async function main(ns) {
	// Launch the farming script if it isn't already running
	if(!ns.isRunning("autoFarm.js", "home")) {
		ns.exec("autoFarm.js", "home");
	}

	let complete = false;

	while(!complete) {
		let player = ns.getPlayer();

		// if we have tor, try and purchase programs
		if(ns.singularity.purchaseTor()) {
			let darkwebPrograms = ns.singularity.getDarkwebPrograms();

			for(let program of darkwebPrograms) {
				// Check if we have purchased things from the darkweb
				if(!ns.fileExists(program, "home")) {
					if(player.money >= ns.singularity.getDarkwebProgramCost(program)) {
						ns.singularity.purchaseProgram(program);
					}
				}
			}

			complete = hasAllPrograms(ns, darkwebPrograms);
		}

		await ns.sleep(10000);
	}
}
