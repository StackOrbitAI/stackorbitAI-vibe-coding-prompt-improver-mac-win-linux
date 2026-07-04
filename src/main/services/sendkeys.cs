using System;
using System.Runtime.InteropServices;
using System.Threading;

class SendKeysApp {
    [DllImport("user32.dll")]
    private static extern short GetAsyncKeyState(int vKey);

    [DllImport("user32.dll")]
    private static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, uint dwExtraInfo);

    private const byte VK_CONTROL = 0x11;
    private const byte KEY_C = 0x43;
    private const byte KEY_V = 0x56;
    private const uint KEYEVENTF_KEYUP = 0x0002;

    [STAThread]
    static void Main(string[] args) {
        if (args.Length > 0) {
            string action = args[0].ToLower();
            
            // Wait up to 1 second for modifier keys (Shift, Alt, Win) to be physically released
            int elapsed = 0;
            while (elapsed < 1000) {
                bool shiftPressed = (GetAsyncKeyState(0x10) & 0x8000) != 0;
                bool altPressed = (GetAsyncKeyState(0x12) & 0x8000) != 0;
                bool winPressed = ((GetAsyncKeyState(0x5B) & 0x8000) != 0) || ((GetAsyncKeyState(0x5C) & 0x8000) != 0);

                if (!shiftPressed && !altPressed && !winPressed) {
                    break;
                }
                Thread.Sleep(15);
                elapsed += 15;
            }

            // Small extra delay to make sure OS processed key release
            Thread.Sleep(50);

            try {
                if (action == "copy" || action == "^c") {
                    SendCopy();
                } else if (action == "paste" || action == "^v") {
                    SendPaste();
                } else {
                    Console.Error.WriteLine("Unknown action: " + action);
                    Environment.Exit(1);
                }
            } catch (Exception ex) {
                Console.Error.WriteLine("Error sending keys: " + ex.Message);
                Environment.Exit(1);
            }
        } else {
            Console.WriteLine("Usage: sendkeys.exe <copy|paste>");
        }
    }

    static void SendCopy() {
        keybd_event(VK_CONTROL, 0, 0, 0); // Ctrl Down
        keybd_event(KEY_C, 0, 0, 0);       // C Down
        keybd_event(KEY_C, 0, KEYEVENTF_KEYUP, 0); // C Up
        keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0); // Ctrl Up
    }

    static void SendPaste() {
        keybd_event(VK_CONTROL, 0, 0, 0); // Ctrl Down
        keybd_event(KEY_V, 0, 0, 0);       // V Down
        keybd_event(KEY_V, 0, KEYEVENTF_KEYUP, 0); // V Up
        keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0); // Ctrl Up
    }
}
