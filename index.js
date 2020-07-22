// ==UserScript==
// @name         Factorial lazy fill
// @namespace    http://tampermonkey.net/
// @version      0.9.9
// @description  This script is for the lazy people like me
// @author       Joaquim Redondo
// @match        https://app.factorialhr.com/*
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    var jq = document.createElement('script');
    jq.src = "https://code.jquery.com/jquery-3.4.1.min.js";

    var jqui = document.createElement('script');
    jqui.src = "https://code.jquery.com/ui/1.12.1/jquery-ui.js"

    var css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('type', 'text/css');
    css.setAttribute('href', 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');

    var icons = document.createElement('link');
    icons.setAttribute('rel', 'stylesheet');
    icons.setAttribute('type', 'text/css');
    icons.setAttribute('href', 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

    var cssCustom = document.createElement('link');
    cssCustom.setAttribute('rel', 'stylesheet');
    cssCustom.setAttribute('type', 'text/css');
    cssCustom.setAttribute('href', 'https://cdn.jsdelivr.net/gh/jredondo92/factorial-filler@latest/index.css');

    document.getElementsByTagName('head')[0].appendChild(jq).appendChild(jqui).appendChild(css).appendChild(icons).appendChild(cssCustom);

    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

    const CATALAN = 'CATALAN'
    const SPANISH = 'SPANISH'
    const ENGLISH = 'ENGLISH'

    const LANG = {
        SPANISH: {
            friday: 'Viernes',
            saturday: 'Sabado',
            save: 'Guardar',
            startProcess: 'Rellenar automáticamente'
        },
        ENGLISH: {
            friday: 'Friday',
            saturday: 'Saturday',
            save: 'Submit',
            startProcess: 'Automatic Fill'
        },
        CATALAN: {
            friday: 'Divendres',
            saturday: 'Dissabte',
            save: 'Desar',
            startProcess: 'Iniciar pruses'
        }
    }

    let selectedLanguage = LANG[ENGLISH]

    function openEverything ({ shouldSkipHoliday = true }) {
        $('tbody tr').each(async function (index, value) {
            var weekDay = $(this).find('[class*="weekDay"]')
            if (isWeekend(weekDay) || shouldSkipDay(this)) {
                return true
            }

            var form = $(this).find('[class*="formLayout"]')
            var addButton = $(form).find('button')

            if (addButton) {
                $(addButton).click()
            } else {
                return true
            }
        })

        changeValues()
        changeValues()
        submitSchedules()
    }

    function isWeekend(weekDay) {
        if (weekDay[0].innerText === 'Saturday' || weekDay[0].innerText === 'Sunday') {
            return true
        }
    }

    function shouldSkipDay(dayRow) {
        const dayColor = $(dayRow).css('background-color')
        if (dayColor === 'rgb(248, 249, 250)' || dayColor === 'rgb(248, 249, 250)' ) {
            return true
        }
    }

    function addStartButton() {
        $('body').append('<div class="addButtonContainer" title="'+ selectedLanguage.startProcess +'"><div id="addButton"><i class="fa fa-play fa-2x"></i></div></div>');
        $( "#addButton" ).click(function() {
            openEverything({ shouldSkipHolidays: true })
        });
    }

    function addDialog() {
        $('html').append(`<div id="dialog-confirm" title="Empty the recycle bin?">
<p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>These items will be permanently deleted and cannot be recovered. Are you sure?</p>
</div>`)
    }

    function openDialog() {
        $( "#dialog-confirm" ).dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Delete all items": function() {
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    }

    function detectLanguage() {
        switch ($('html').find('[class*="worked_hours"]').find('[class*="text"]').text().toUpperCase()) {
            case 'HORAS TRABAJADAS':
                selectedLanguage = LANG[SPANISH]
                break;
            case 'WORKED HOURS':
                selectedLanguage = LANG[ENGLISH]
                break;
            case 'HORES TREBALLADES':
                selectedLanguage = LANG[CATALAN]
                break;
            default:
                break;
        }

    }

    function changeValues() {
        $('tbody tr').each(async function (index, value) {
            var weekDay = $(this).find('[class*="weekDay"]')
            if (isWeekend(weekDay) || shouldSkipDay(this)) {
                return true
            }

            var form = $(this).find('[class*="formLayout"]')
            var inputs = $(form).find('input')
            if ($(inputs[0]).attr('disabled') || inputs.length === 0) return true

            const e = new Event('input', {bubbles: true})

            setNativeValue(inputs[0], "9:00");
            setNativeValue(inputs[1], "13:00");
            setNativeValue(inputs[2], "14:30");
            setNativeValue(inputs[3], "18:30");

            inputs[0].dispatchEvent(e)
            inputs[1].dispatchEvent(e)
            inputs[2].dispatchEvent(e)
            inputs[3].dispatchEvent(e)

            await new Promise(r => setTimeout(r, 1000));

        })
    }

    function submitSchedules() {
        $("button:contains("+selectedLanguage.save+")").each(function (index, value) {
            $(this).click()
        })
    }

    function startProcess() {
        detectWindowChange()
        detectLanguage()
        addStartButton()
    }

    function detectWindowChange() {
        history.pushState = ( f => function pushState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.pushState);

        history.replaceState = ( f => function replaceState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate',()=>{
            window.dispatchEvent(new Event('locationchange'))
        });
    }

    window.addEventListener('locationchange', function(){
        document.getElementsByClassName('addButtonContainer')[0].remove()

        setTimeout(function() {
            waitToBeLoaded()
        }, 500);
    })

    function waitToBeLoaded () {
        var waitForEl2 = function(selector, callback) {
            if (jQuery(selector).length) {
                callback();
            } else {
                setTimeout(function() {
                    waitForEl(selector, callback);
                }, 100);
            }
        };

        waitForEl2('[class*="worked_hours"]', function() {
            addStartButton()
        });
    }

    var waitForEl = function(selector, callback) {
        if (jQuery(selector).length) {
            callback();
        } else {
            setTimeout(function() {
                waitForEl(selector, callback);
            }, 100);
        }
    };

    waitForEl('[class*="worked_hours"]', function() {
        if (window.location.href.indexOf('clock-in') > -1) {
        startProcess()
        }
    });
})();