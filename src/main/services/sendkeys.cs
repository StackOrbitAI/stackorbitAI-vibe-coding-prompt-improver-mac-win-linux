using System;
using System.Windows.Forms;
using System.Threading;

class SendKeysApp {
    [STAThread]
    static void Main(string[] args) {
        if (args.Length > 0) {
            // Wait 100ms to allow the user's physical key release to complete before injecting keys
            Thread.Sleep(100);
            try {
                SendKeys.SendWait(args[0]);
            } catch (Exception ex) {
                Console.Error.WriteLine("Error sending keys: " + ex.Message);
                Environment.Exit(1);
            }
        } else {
            Console.WriteLine("Usage: sendkeys.exe <keys>");
            Console.WriteLine("Example: sendkeys.exe \"^c\" (sends Ctrl+C)");
            Console.WriteLine("Example: sendkeys.exe \"^v\" (sends Ctrl+V)");
        }
    }
}
