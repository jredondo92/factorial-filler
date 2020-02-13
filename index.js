var jq = document.createElement('script');
jq.src = "https://code.jquery.com/jquery-3.4.1.min.js";  /* Include any online jquery library you need */

var jqui = document.createElement('script');
jqui.src = "https://code.jquery.com/ui/1.12.1/jquery-ui.js"

var css = document.createElement('link');
css.setAttribute('rel', 'stylesheet');
css.setAttribute('type', 'text/css');
css.setAttribute('href', 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');

var cssCustom = document.createElement('link');
cssCustom.setAttribute('rel', 'stylesheet');
cssCustom.setAttribute('type', 'text/css');
cssCustom.setAttribute('href', 'https://cdn.jsdelivr.net/gh/jredondo92/factorial-filler/index.css');

document.getElementsByTagName('head')[0].appendChild(jq).appendChild(jqui).appendChild(css);

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
    save: 'Submit',
    startProcess: 'RELLENAR AUTOMATICAMENTE'
  },
  ENGLISH: {
    friday: 'Friday',
    saturday: 'Saturday',
    save: 'Guardar',
    startProcess: 'AUTO FILL'
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
        var addButton = $(form).find('button[class*="terciary"]')

        if (addButton) {
            $(addButton).click()
        } else {
            return true
        }
    })

    changeValues()
    changeValues()
    // submitSchedules()
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
    $('html').find('[class*="box"]').after('<div style="margin-bottom:25px; display:flex;justify-content:center"><div style="height:50px;padding:13px 23px; background-color:#7c73e6;color:white;width:40%;text-align:center">'+selectedLanguage.startProcess+'</div></div>')
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
  switch ($('html').find('[class*="text"]').text().toUpperCase()) {
    case 'HORAS TRABAJADAS':
      selectedLanguage = LANG[SPANISH]
      break;
    case 'WORKED HOURS':
      selectedLanguage = LANG[ENGLISH]
      break;
    case 'HORES TREBALLADES':
      selectedLanguage = LANG[CATALAN]
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

        if ($(inputs[0]).attr('disabled')) return true

        const e = new Event('input', {bubbles: true})

        setNativeValue(inputs[0], "10:00");
        setNativeValue(inputs[1], "13:00");
        setNativeValue(inputs[2], "14:30");
        setNativeValue(inputs[3], "19:00");

        inputs[0].dispatchEvent(e)
        inputs[1].dispatchEvent(e)
        inputs[2].dispatchEvent(e)
        inputs[3].dispatchEvent(e)

        await new Promise(r => setTimeout(r, 1000));

    })
}

function submitSchedules() {
    $("button:contains("+LANG[selectedLanguage].save+")").each(function (index, value) {
        $(this).click()
    })
}