<html>

<head>
    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    <script>
    var audioBuffer = null;
    var context = null;
    window.addEventListener('load', init, false);
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var source;

    function init() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            console.log('init')
        } catch (e) {
            alert('Web Audio API is not supported in this browser');
        }
    }

   
    function playSound() {
        source = audioContext.createBufferSource();
        source.buffer = playSoundBuffer;
        source.connect(audioContext.destination);
        source.start(0);
        console.log('playsound')
    }

    var socket = io.connect('http://127.0.0.1:9000/music');
    socket.on('connection', function(data) {

        source = audioCtx.createBufferSource();
        var request = new XMLHttpRequest();
        console.log('inside')
        request.open("GET", "./audio/inside.mp3", true);
        request.responseType = "arraybuffer";
        request.onload = function() {
            var audioData = new ArrayBuffer(request.response);
            audioContext.decodeAudioData(audioData, function(buffer) {
                console.log('here')
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.loop = true; // don't start processing it before the response is there!
            }, function(error) {
                console.error("decodeAudioData error", error);
            });
        };
        request.send();
    });

    </script>
</head>

<body>
    <h2>Music streaming</h2>
</body>

</html>
