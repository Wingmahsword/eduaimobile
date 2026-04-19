import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const INJECTED_SCRIPT = `
(function() {
  const video = document.getElementById('hls-video');
  const src = window.__HLS_SRC__;
  const muted = window.__HLS_MUTED__;

  video.muted = muted;
  video.playsInline = true;
  video.loop = true;
  video.autoplay = true;

  function startNativeHls() {
    video.src = src;
    video.play().catch(function() {});
  }

  if (window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls({
      enableWorker: true,
      lowLatencyMode: true,
    });
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
      video.play().catch(function() {});
    });
    window.__PLAYER__ = hls;
  } else {
    startNativeHls();
  }
})();
true;
`;

function buildHtml({ hlsUrl, muted }) {
  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000;
      }
      #hls-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background: #000;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  </head>
  <body>
    <video id="hls-video" playsinline webkit-playsinline muted></video>
    <script>
      window.__HLS_SRC__ = ${JSON.stringify(hlsUrl)};
      window.__HLS_MUTED__ = ${JSON.stringify(muted)};
    </script>
  </body>
</html>
`;
}

export default function HlsVideoPlayer({ hlsUrl, muted, shouldPlay, style }) {
  if (!hlsUrl || !shouldPlay) {
    return <View style={[styles.video, style]} />;
  }

  return (
    <WebView
      key={`${hlsUrl}-${muted}`}
      style={[styles.video, style]}
      source={{ html: buildHtml({ hlsUrl, muted }) }}
      originWhitelist={['*']}
      javaScriptEnabled
      injectedJavaScript={INJECTED_SCRIPT}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      scrollEnabled={false}
      bounces={false}
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
});
