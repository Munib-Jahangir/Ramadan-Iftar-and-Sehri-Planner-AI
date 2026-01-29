package com.sehrify.ai;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.widget.Toast;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Easter Egg: Made by Munib Jahangir
        Toast.makeText(this, "Sehrify AI ❤️ Made by Munib Jahangir", Toast.LENGTH_LONG).show();
    }
}
