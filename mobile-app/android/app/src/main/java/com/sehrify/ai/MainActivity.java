package com.sehrify.ai;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.widget.Toast;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Ensure webview doesn't go behind system navigation bars
        this.bridge.getWebView().setFitsSystemWindows(true);
        
        // Easter Egg: Made by Munib Jahangir
        Toast.makeText(this, "Sehrify AI ❤️ Made by Munib Jahangir", Toast.LENGTH_LONG).show();
    }
}
