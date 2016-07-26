System = require('system');
var page = require('webpage').create();
page.viewportSize = { width: 960, height: 540 };

TIMEOUT = 90;

var address = System.args[1],
    duration = parseInt(System.args[2]),
    totalFrames = duration * 24; //24 fps video

page.open(address, function(){
  setTimeout(function() {
    // Initial frame
    var frame = 0;
    // Add an interval every 25th second
    setInterval(function() {
      // Render an image with the frame name
      page.render('/dev/stdout', { format: "png" });
      frame++;
      if(frame >= totalFrames) {
        phantom.exit();
      }
    }, 81);
  });
});

// In case something hangs, kill it all after 90 seconds
setTimeout(function() {
  console.error("Waited " + TIMEOUT + " seconds, terminating");
  phantom.exit(1);
}, TIMEOUT*1000);

//phantomjs screenshotter.js http://localhost:8000 3 | ffmpeg -y -c:v png -f image2pipe -r 25 -t 10  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart barchart.mp4
