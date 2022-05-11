import { deployScript } from "./deployScript.js";

let infected = [];

async function infect(ns, host, scriptName, target) {	
	// Only need to infect each host once, if we already did return
	if(infected.includes(host)) {
		return;
	}

	// Mark the host as infected
	infected.push(host);

	let hosts = ns.scan(host);

	// Try to infect scanned servers
	for (let i = 0; i < hosts.length; i++) {
		// Check if hackable
		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(hosts[i])) {
			// Run brutessh
			if(ns.fileExists("BruteSSH.exe", "home")) {
				ns.brutessh(hosts[i]);
			}

			// Run FTPCrack
			if(ns.fileExists("FTPCrack.exe", "home")) {
				ns.ftpcrack(hosts[i]);
			}

			// relaySMTP
			if(ns.fileExists("relaySMTP.exe", "home")) {
				ns.relaysmtp(hosts[i]);
			}

			// HTTPWorm
			if(ns.fileExists("HTTPWorm.exe", "home")) {
				ns.httpworm(hosts[i]);
			}

			// SQLInject
			if(ns.fileExists("SQLInject.exe", "home")) {
				ns.sqlinject(hosts[i]);
			}

			// Check if we have root access already
			if (!ns.hasRootAccess(hosts[i])) {
				// If we don't, get it
				ns.nuke(hosts[i]);
				ns.toast("Gained root on " + hosts[i]);
			}

			await deployScript(ns, scriptName, hosts[i], target);				
		}

		await infect(ns, hosts[i], scriptName, target);
	}
}

/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[0];
	let scriptName = ns.args[1];

	while (true) {		
		await infect(ns, ns.getHostname(), scriptName, target);
		await ns.sleep(10000);
	}
}
