const path = require('path');
require('json-editor');
var jsonfile = require('jsonfile')
var fs = require('fs');
var schemaFile = path.join(__dirname, '../../viz_templates/chitram_bar_chart/inputschema.json');
var inputSchema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
var editor = new JSONEditor(document.getElementById('editor-holder'),
                            {
                              disable_properties: true,
                              disable_collapse: true,
                              theme: 'foundation6',
                              iconlib:'fontawesome4',
                              show_errors:'change',
                              schema: inputSchema
                            });

const previewBtn = document.getElementById('preview-button')

previewBtn.addEventListener('click', function (event) {
  var editorErrors = editor.validate()
  if(editorErrors.length){
    var errorDiv = document.getElementById('editor-errors')
    errorDiv.innerHTML = ''
    errorDiv.innerHTML = "There are errors in the form".
    return;
  }

  var obj = editor.getValue()
  var dataFile = obj.projectName
  var duration = obj.duration;
  var file = require('path').join(__dirname, '../../viz_templates/'
                                              + event.target.dataset.template
                                              + '/data/' + dataFile + '.json')
  jsonfile.writeFile(file, obj)
  const BrowserWindow = require('electron').remote.BrowserWindow
  const modalPath = 'http://127.0.0.1:60923/'
                    + event.target.dataset.template
                    +'/index.html?dataFile=' + dataFile

  let win = new BrowserWindow({ width: 1000,
                                height: 600,
                                nodeIntegration: false,
                                webPreferences: {
                                    webSecurity: false
                                }
                              })
  win.on('closed', function () { win = null })
  win.loadURL(modalPath, {"extraHeaders" : "pragma: no-cache\n"})
  win.show()
});


const captureBtn = document.getElementById('capture-video-button')
captureBtn.addEventListener('click', function (event) {
  var fileName = editor.getValue().projectName
  var duration = editor.getValue().duration
  var createVideoScript = require('path').join(__dirname, '../../bash/create-video.sh')
  const chartUri = 'http://127.0.0.1:60923/' + event.target.dataset.template
                   + '/index.html?dataFile=' + fileName
  const videoFile = '/tmp/' + event.target.dataset.template + '.mp4'
  const videoOut = document.getElementById('capture-video-status')
  const spawn = require('child_process').spawn;
  const createVideo = spawn(createVideoScript, [chartUri, videoFile, duration]);

  createVideo.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  createVideo.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  createVideo.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    if(code == 0) {
      videoOut.innerText += `Video creation succeeded, Video is at ${videoFile}`
    } else {
      videoOut.innerText += `Video creation failed with code ${code}`
    }
  });

});
