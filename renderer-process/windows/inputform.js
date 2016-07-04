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
                              theme: 'foundation5',
                              schema: inputSchema
                            });

const previewBtn = document.getElementById('preview-button')
previewBtn.addEventListener('click', function (event) {
  var file = require('path').join(__dirname, '../../viz_templates/'+event.target.dataset.template +'/data/data.json')
  var obj = editor.getValue()
  jsonfile.writeFile(file, obj)
  const BrowserWindow = require('electron').remote.BrowserWindow
  const modalPath = 'http://127.0.0.1:60923/' + event.target.dataset.template +'/index.html'
  console.log(modalPath)
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
