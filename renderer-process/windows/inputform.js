const path = require('path');
require('json-editor');
var jsonfile = require('jsonfile')
var fs = require('fs');
window.$ = require('../../assets/js/jquery.js')
window.jQuery = require('../../assets/js/jquery.js')
var foundation = require('../../assets/js/foundation.js')

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
var writeDataFile = function(fileName, templateName, data){
  var file = require('path').join(__dirname, '../../viz_templates/'
                                              + templateName
                                              + '/data/' + fileName + '.json')
  jsonfile.writeFile(file, data)
}
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
  writeDataFile(dataFile, event.target.dataset.template, obj)
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

const backBtn = document.getElementById('back-button')
backBtn.addEventListener('click', function(){
  video = document.getElementById('result-video')
  video.pause()
  window.$('#result-video').addClass('hide')
  window.$("#result").addClass('hide')
  window.$("#spinner").addClass('hide')
  window.$("#form-holder").removeClass('hide')
})

const captureBtn = document.getElementById('capture-video-button')
captureBtn.addEventListener('click', function (event) {
  // UI updates
  window.$("#form-holder").addClass('hide')
  window.$("#spinner").removeClass('hide')

  var fileName = editor.getValue().projectName
  var duration = editor.getValue().duration
  writeDataFile(fileName, event.target.dataset.template, editor.getValue())
  var createVideoScript = require('path').join(__dirname, '../../bash/create-video.sh')
  const chartUri = 'http://127.0.0.1:60923/' + event.target.dataset.template
                   + '/index.html?dataFile=' + fileName
                   +'&slowmo=true'
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
      window.$('#result-video source').attr('src', videoFile)
      window.$("#result").removeClass('hide')
      window.$("#spinner").addClass('hide')

      video = document.getElementById('result-video');
      video.load()
      video.play()

      // videoOut.innerText += `Video creation succeeded, Video is at ${videoFile}`
    } else {
      window.$('#result-video').addClass('hide')
      videoOut.innerText += `Video creation failed with code ${code}`
    }
  });

});
