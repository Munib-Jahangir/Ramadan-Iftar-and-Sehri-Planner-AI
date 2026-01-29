package com.sehrify.ai;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.widget.Toast;

import android.view.View;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        final View webView = this.bridge.getWebView();
        
        // Premium Fix: Programmatically add padding so content never gets cut by system bars
        ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
            int top = insets.getInsets(WindowInsetsCompat.Type.systemBars()).top;
            int bottom = insets.getInsets(WindowInsetsCompat.Type.systemBars()).bottom;
            v.setPadding(0, top, 0, bottom);
            return insets;
        });
        
        // Easter Egg: Made by Munib Jahangir
        Toast.makeText(this, "Sehrify AI ❤️ Made by Munib Jahangir", Toast.LENGTH_LONG).show();
    }
}
