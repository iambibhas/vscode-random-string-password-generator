var vscode = require('vscode');
function activate(context) {
    var disposableVariable = vscode.commands.registerCommand('rspg.variableLength', function () {
        vscode.window.showInputBox({
            'validateInput': validateInputNumber,
            'placeHolder': 'Enter length',
            'prompt': 'Enter desired string/password length',
            'value': '12'
        }).then(function(length) {
            if (length === undefined) {
                vscode.window.showErrorMessage('Please input a positive integer number.')
                return;
            }

            vscode.window.showQuickPick([
                {
                    'label': 'Low Strength - Combination of lower case characters and numbers',
                    'detail': 'low'
                },
                {
                    'label': 'Medium Strength - Combination of lower case characters, upper case characters and numbers',
                    'detail': 'medium'
                },
                {
                    'label': 'High Strength - Combination of lower case characters, upper case characters, numbers and special characters',
                    'detail': 'high'
                }
            ]).then(function(item) {
                var strength = item.detail;
                var generated_string = generateRandomString(length, strength);
                // vscode.window.showInformationMessage('Generated string is: ' + generated_string);
                placeTextOnEditor(generated_string);
            });
        });
    });
    var disposableLowPassword = vscode.commands.registerCommand('rspg.lowPassword', function () {
        var generated_string = generateRandomString(10, 'low');
        placeTextOnEditor(generated_string);
    });
    var disposableMediumPassword = vscode.commands.registerCommand('rspg.mediumPassword', function () {
        var generated_string = generateRandomString(15, 'medium');
        placeTextOnEditor(generated_string);
    });
    var disposableHighPassword = vscode.commands.registerCommand('rspg.highPassword', function () {
        var generated_string = generateRandomString(25, 'high');
        placeTextOnEditor(generated_string);
    });

    context.subscriptions.push(disposableVariable);
    context.subscriptions.push(disposableLowPassword);
    context.subscriptions.push(disposableMediumPassword);
    context.subscriptions.push(disposableHighPassword);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;

function placeTextOnEditor(generated_string) {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }

    var selection = editor.selection;
    console.log(selection);
    var text = editor.document.getText(selection);

    editor.edit(function (editBuilder) {
        if (text.length === 0) {
            editBuilder.insert(selection.anchor, generated_string);
        } else {
            editBuilder.replace(selection, generated_string);
        }
    })
}

function generateRandomString(length, strength) {
    if (length === undefined) {
        length = 8;
    }
    if (strength === undefined) {
        strength = 'low';
    }
    var ascii_lower = 'abcdefghijklmnopqrstuvwxyz';
    var ascii_upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var digits = '0123456789';
    var specials = '`~!@#$%^&*()_+-={}|[]\:";\'<>?,./';

    var valid_chars = '';
    if (strength == 'low') {
        valid_chars = ascii_lower + digits;
    } else if (strength == 'medium') {
        valid_chars = ascii_lower + ascii_upper + digits;
    } else if (strength == 'high') {
        valid_chars = ascii_lower + ascii_upper + digits + specials;
    }

    var generated_string = '';
    for (var index = 0; index < length; index++) {
        generated_string += valid_chars[Math.floor(Math.random()*valid_chars.length)];
    }
    return generated_string;
}

function validateInputNumber(input) {
    if (isNormalInteger(input)) {
        return '';
    } else {
        return 'Please input a valid positive integer number';
    }
}

function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n > 0;
}