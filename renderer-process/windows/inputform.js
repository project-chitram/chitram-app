const path = require('path');
require('json-editor');
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
  console.log(event.target.dataset.template)
  const BrowserWindow = require('electron').remote.BrowserWindow
  const path = require('path')

  const modalPath = path.join('http://localhost:90923/viz_templates/'+event.target.dataset.template +'/index.html')
  let win = new BrowserWindow({ width: 1000, height: 600 })
  win.on('closed', function () { win = null })
  win.loadURL(modalPath)
  win.show()
});
