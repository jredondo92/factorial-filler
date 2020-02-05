var jq = document.createElement('script');
jq.src = "https://code.jquery.com/jquery-3.4.1.min.js";  /* Include any online jquery library you need */
document.getElementsByTagName('head')[0].appendChild(jq);

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

function openEverything ({ shouldSkipHoliday }) {
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
    $("button:contains('Submit')").each(function (index, value) {
        $(this).click()
    })
}

