//#include "ui/EffectWindow_ui.jsx"
#include "ui/testUI.jsx"
//#include "logic/test_logic.jsx"

function main(windowObj) {
    if (testPanel instanceof Window && !testPanel.hidden){testPanel.close()}//close any previous version of this panel if they exist
    var testPanel = TestUI.createAlertTestPanel(windowObj);//make a window
    testPanel.layout.layout(true);//refresh the layout
    
    if (testPanel != null && testPanel instanceof Window){//show the window
            testPanel.center();
            testPanel.show();
            }
}
main(this);