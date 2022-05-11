export async function deployScript(ns, scriptName, host, target) {

	if (!ns.scriptRunning(scriptName, host)) {
		await ns.scp(scriptName, host);

		let ramCost = ns.getScriptRam(scriptName, host);
		let maximumRam = ns.getServerMaxRam(host);
		let usedRam = ns.getServerUsedRam(host);
		let freeRam = maximumRam - usedRam;
		let threads = Math.floor(freeRam / ramCost);

		if (threads >= 1) {
			ns.exec(scriptName, host, threads, target);
			ns.toast(scriptName + " installed on " + host + " with " + threads + " threads");
		}
	}
}
