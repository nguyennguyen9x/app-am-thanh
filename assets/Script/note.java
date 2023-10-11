/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import android.Manifest;
import android.app.Dialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.AudioTrack;
import android.media.MediaMetadataRetriever;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.PersistableBundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import static android.Manifest.permission.RECORD_AUDIO;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.json.JSONException;

import android.os.Bundle;

import android.content.Intent;
import android.content.res.Configuration;
import android.util.Log;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;

import thay.thanh.R;

public class AppActivity extends Cocos2dxActivity {
    public static String TAG = "cocos2djs";
    private static final String LOG_TAG = "AudioRecordTest";
    private static final int REQUEST_RECORD_AUDIO_PERMISSION = 200;
    private static String fileName = null;

    private RecordButton recordButton = null;
    private Recorder recorder = null;

    private PlayButton playButton = null;
    private MediaPlayer player = null;

    // Requesting permission to RECORD_AUDIO
    private boolean permissionToRecordAccepted = false;
    private String[] permissions = { Manifest.permission.RECORD_AUDIO };

    /////////////////////////////////////////////////////////////
    private final int duration = 3; // seconds
    private final int sampleRate = 44100;
    private final int numSamples = duration * sampleRate;
    private final double sample[] = new double[numSamples];
    private final double freqOfTone = 5000; // hz

    private final byte generatedSnd[] = new byte[2 * numSamples];
    Handler handler = new Handler();

    public static void ghi(final boolean param) throws JSONException, UnsupportedEncodingException {
        Log.v("JAVASCRIPT_2_ANDROID", "ghi " + param);
        save_ins.onRecord(param);
    }

    public static void phat(final boolean param) throws JSONException, UnsupportedEncodingException {
        Log.v("JAVASCRIPT_2_ANDROID", "phat " + param);
        save_ins.onPlay(param);
    }

    public static void onCallFromJavascript(final String evt, final String params)
            throws JSONException, UnsupportedEncodingException {
        Log.v("JAVASCRIPT_2_ANDROID", "---onCallFromJavascript === EVT " + evt + " Data: " + params);

        // save_ins.startRecording();
        save_ins.playAudio();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
            @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case REQUEST_RECORD_AUDIO_PERMISSION:
                permissionToRecordAccepted = grantResults[0] == PackageManager.PERMISSION_GRANTED;
                break;
        }
        if (!permissionToRecordAccepted)
            finish();

    }

    private void onRecord(boolean start) {
        if (start) {
            startRecording();
        } else {
            stopRecording();
        }
    }

    private void onPlay(boolean start) {
        if (start) {
            startPlaying();
        } else {
            stopPlaying();
        }
    }

    ImageView album_art;
    TextView album, artist, genre;

    MediaMetadataRetriever metaRetriver;
    byte[] art;

    private void startPlaying() {
        player = new MediaPlayer();
        try {
            // player.setDataSource(fileName);
            // player.prepare();
            // Log.e(TAG, "=========>"+player.bu);
            // player.start();
            // if(ContextCompat.checkSelfPermission(this,recor))
            Log.e(LOG_TAG, "prepare() failed = " + player.getAudioSessionId());
            player.getAudioSessionId();
        } catch (Error e) {
            Log.e(LOG_TAG, "prepare() failed");
        }
    }

    private void stopPlaying() {
        player.release();
        player = null;
    }

    private int audioSource = MediaRecorder.AudioSource.DEFAULT;
    private int channelConfig = AudioFormat.CHANNEL_IN_MONO;
    private int audioEncoding = AudioFormat.ENCODING_PCM_16BIT;
    private AudioCalculator audioCalculator;

    private void startRecording() {
        Log.e(LOG_TAG, "startRecording");
        // recorder = new MediaRecorder();
        // recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        // recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        // recorder.setOutputFile(fileName);
        // recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
        // Log.e(LOG_TAG, "startRecording");
        //// int minBufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig,
        // audioEncoding);
        //// if (ActivityCompat.checkSelfPermission(this,
        // Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
        //// Log.e(LOG_TAG, "return");
        //// return;
        //// }
        //// AudioRecord recorder = new AudioRecord(audioSource, sampleRate,
        // channelConfig, audioEncoding, minBufferSize);
        //// byte[] buffer = new byte[minBufferSize];
        // recorder.startRecording();
        // audioCalculator = new AudioCalculator();
        // handler = new Handler(Looper.getMainLooper());
        // onBufferAvailable(buffer);
        //
        // if (recorder.getState() == AudioRecord.STATE_UNINITIALIZED) {
        // Thread.currentThread().interrupt();
        // return;
        // } else {
        // Log.i(LOG_TAG, "Started.");
        // // callback.onStart();
        // }
        //
        // recorder.startRecording();
        recorder = new Recorder(callback);
        audioCalculator = new AudioCalculator();
        handler = new Handler(Looper.getMainLooper());
        recorder.start();
    }

    private Callback callback = new Callback() {

        @Override
        public void onBufferAvailable(byte[] buffer) {
            audioCalculator.setBytes(buffer);
            int amplitude = audioCalculator.getAmplitude();
            double decibel = audioCalculator.getDecibel();
            double frequency = audioCalculator.getFrequency();

            final String amp = String.valueOf(amplitude + " Amp");
            final String db = String.valueOf(decibel + " db");
            final String hz = String.valueOf(frequency + " Hz");

            handler.post(new Runnable() {
                @Override
                public void run() {
                    Log.i(LOG_TAG, amp);
                    Log.i(LOG_TAG, db);
                    Log.i(LOG_TAG, hz);

                }
            });
        }
    };

    private void stopRecording() {
        recorder.stop();
    }

    class RecordButton extends androidx.appcompat.widget.AppCompatButton {
        boolean mStartRecording = true;

        OnClickListener clicker = new OnClickListener() {
            public void onClick(View v) {
                onRecord(mStartRecording);
                if (mStartRecording) {
                    setText("Stop recording");
                } else {
                    setText("Start recording");
                }
                mStartRecording = !mStartRecording;
            }
        };

        public RecordButton(Context ctx) {
            super(ctx);
            setText("Start recording");
            setOnClickListener(clicker);
        }
    }

    class PlayButton extends androidx.appcompat.widget.AppCompatButton {
        boolean mStartPlaying = true;

        OnClickListener clicker = new OnClickListener() {
            public void onClick(View v) {
                onPlay(mStartPlaying);
                if (mStartPlaying) {
                    setText("Stop playing");
                } else {
                    setText("Start playing");
                }
                mStartPlaying = !mStartPlaying;
            }
        };

        public PlayButton(Context ctx) {
            super(ctx);
            setText("Start playing");
            setOnClickListener(clicker);
        }
    }

    public static AppActivity save_ins;
    WebView webView;

    private ValueCallback<Uri> mUploadMessage;
    public ValueCallback<Uri[]> uploadMessage;
    public static final int REQUEST_SELECT_FILE = 100;
    private final static int FILECHOOSER_RESULTCODE = 1;
    private static String url_webview_new = "https://phet.colorado.edu/sims/html/waves-intro/latest/waves-intro_all.html?fbclid=IwAR1O54icr8SNqoXW5CtsLSdubk5O05JX0512bp0k2CcxIvcxH3K_W_41z0g";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);
        save_ins = this;

        fileName = getExternalCacheDir().getAbsolutePath();
        fileName += "/audiorecordtest.mp3";

        ActivityCompat.requestPermissions(this, permissions, REQUEST_RECORD_AUDIO_PERMISSION);
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    void genTone() {
        // fill out the array
        for (int i = 0; i < numSamples; ++i) {
            sample[i] = Math.sin(2 * Math.PI * i / (sampleRate / freqOfTone));
        }

        // convert to 16 bit pcm sound array
        // assumes the sample buffer is normalised.
        int idx = 0;
        for (final double dVal : sample) {
            // scale to maximum amplitude
            final short val = (short) ((dVal * 32767));
            // in 16 bit wav PCM, first byte is the low order byte
            generatedSnd[idx++] = (byte) (val & 0x00ff);
            generatedSnd[idx++] = (byte) ((val & 0xff00) >>> 8);

        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
        // final Thread thread = new Thread(new Runnable() {
        // public void run() {
        // genTone();
        // handler.post(new Runnable() {
        //
        // public void run() {
        // playSound();
        // }
        // });
        // }
        // });
        // thread.start();
    }

    void playAudio() {
        final Thread thread = new Thread(new Runnable() {
            public void run() {
                genTone();
                handler.post(new Runnable() {

                    public void run() {
                        playSound();
                    }
                });
            }
        });
        thread.start();
    }

    void playSound() {
        final AudioTrack audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC,
                sampleRate, AudioFormat.CHANNEL_CONFIGURATION_MONO,
                AudioFormat.ENCODING_PCM_16BIT, numSamples,
                AudioTrack.MODE_STATIC);
        audioTrack.write(generatedSnd, 0, generatedSnd.length);
        audioTrack.play();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        // Workaround in
        // https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }

        SDKWrapper.getInstance().onDestroy();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
        if (recorder != null) {
            recorder = null;
        }

        if (player != null) {
            player.release();
            player = null;
        }
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }
}
