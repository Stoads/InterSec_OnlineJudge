var EL = (sel) => document.querySelector(sel);
const submit = EL('#submit');
var textarea = EL('#editor');
var code = EL('#code');
var editor = CodeMirror.fromTextArea(textarea, {
  lineNumbers: true,
  lineWrapping: true,
  smartIndent: true,
  styleActiveLine: true,
  indentWithTabs: true,
  keyMap: "sublime",
  theme: "monokai",
  tabSize: 2,
  val: textarea.value,
  mode: 'clike',
  matchBrackets: true,
  autoCloseTags: true,
  extraKeys: {
    Tab: function(cm) {
      if (cm.getSelection().length) {
        CodeMirror.commands.indentMore(cm);
      } else {
        cm.replaceSelection(' ', 'end');
      }
    },
    'Shift-Tab': function(cm) {
      CodeMirror.commands.indentLess(cm);
    },
    "Ctrl-Space": "autocomplete"
  },
});

submit.addEventListener('click',function(){
  code.value = editor.getValue();
  EL('#form_tag').submit();
})
