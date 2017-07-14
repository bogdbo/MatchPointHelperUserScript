// ==UserScript==
// @name         MatchPoint Helper
// @namespace    http://bogdan.com
// @version      0.6
// @description  try to take over the world!!
// @author       bbogdan
// @match        https://*/*ConfigEditorForm.aspx*
// @match        http://*/*ConfigEditorForm.aspx*
// @grant        none
// ==/UserScript==

(function() {
    fixCodeMirror();
    addConfigOpenAction();
    addTreeHelper();
})();


function fixCodeMirror() {
    $('head').append('<style type="text/css">#__PopupMenu { margin-left: 34px; top:40px !important; }</style>');
    $('.mp-codeTextBoxTitle img[event=Toggle]').click(function() {
        $(this).parents('.mp-codeTextBox').find('.CodeMirror-scroll').height(`${window.innerHeight - 50}px`);
    });
}

function addTreeHelper() {
    var style = "cursor:pointer; margin-right:10px; font-family:monospace; ";
    var handleClick = alt => {
        $(`img[alt^=${alt}]`).each((i,e) => e.parentElement.click());
    };
    var expander =  $(`<span style="${style}">[ + ]</span>`).click(_ => handleClick('Expand'));
    var collapser = $(`<span style="${style}">[ - ]</span>`).click(_ => handleClick('Collapse'));
    const shouldExpand = getStorage('autoexpand') == 'true';
    var checkbox =  $(`<input style="${style}" type="checkbox" title="Expand automatically"/>`).prop('checked', shouldExpand).change(function() { setStorage('autoexpand', this.checked); });
    $('.mp-ceTreeCell').prepend(checkbox, expander, collapser);
    if (shouldExpand) {
        expander.click();
    }
}

function addConfigOpenAction() {
    var editorPath = window.location.href.split('?')[0];
    $('select').each(function(i, e) {
        var $addLink = $('<a href="#">Open</a>').click(_ => {
            var url = getUrl(e.value);
            if (url) {
                window.open(url,'_blank');
            } else {
                alert('cannot determine configuration');
            }

            event.preventDefault();
        });
        if (getUrl(e.value) || !e.value) {
            $(e).parents('tr:first').children().first().append($addLink);
        }
    });

    function getUrl(val) {
        if (val) {
            var parts = val.split('#');
            if (parts.length === 2) {
                if (parts[1].endsWith('.xml')) {
                    return `${editorPath}?Type=${parts[0]}&File=${parts[1]}&Source=${encodeURIComponent(window.location.href)}`;
                }
            }
        }

        return null;
    }
}

function setStorage(key, value) {
    window.localStorage[`MatchPointHelper-${key}`] = value;
}

function getStorage(key, value) {
    return  window.localStorage[`MatchPointHelper-${key}`];
}
