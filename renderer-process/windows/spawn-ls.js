const spawnLsBtn = document.getElementById('spawn-ls-button')

spawnLsBtn.addEventListener('click', function (event) {
	const spawnLsOut = document.getElementById('spawn-ls-out')
 	const spawn = require('child_process').spawn;
	const ls = spawn('ls', ['-lh', '/usr']);

	ls.stdout.on('data', (data) => {
	  console.log(`stdout: ${data}`);
	  spawnLsOut.innerText += `stdout: ${data}`
	});

	ls.stderr.on('data', (data) => {
	  console.log(`stderr: ${data}`);
	  spawnLsOut.innerText += `stderr: ${data}`
	});

	ls.on('close', (code) => {
	  console.log(`child process exited with code ${code}`);
	  spawnLsOut.innerText += `child process exited with code ${code}`
	});
})

