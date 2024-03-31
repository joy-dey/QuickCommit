const COMMIT_FORM = document.querySelector('#commit-form'),
      TICKET_NAME_FIELD = document.querySelector('#ticketName'),
      UPDATES_TEXTAREA = document.querySelector('#updates')
      BUILD_CHOICE = document.getElementsByName('hasBuild'),
      COPY_BUTTON = document.querySelector('#copyButton');


document.addEventListener('DOMContentLoaded', function() {
    UPDATES_TEXTAREA.value = '- ';
})

UPDATES_TEXTAREA.addEventListener('keyup', function(e) {
    if (e.code === 'Enter') {
        UPDATES_TEXTAREA.value += '- ';
    }
})

BUILD_CHOICE.forEach(choice => {
    choice.addEventListener('change', function(e) {
        if(e.target.value === 'Yes') {
            document.querySelector('#buildUrl').parentElement.style.display = 'flex';
        } else {
            document.querySelector('#buildUrl').parentElement.style.display = 'none';
        }
    })
})

COMMIT_FORM.addEventListener('submit', function(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    document.querySelector('#output').value = generateCommitMessage(processData(data)) 
})

COPY_BUTTON.addEventListener('click', function() {
    const clipboard = navigator.clipboard;
    clipboard.writeText(document.querySelector('#output').value).then(() => {
        alert('Copied to Clipboard')
    })
})

function formatString(inputString) {
    let cleanString = inputString.replace(/[^\w\s]/g, ''),
        formattedString = cleanString.trim().replace(/\s+/g, '-').toLowerCase();
    return formattedString;
}

function processData(data) {
    const DATE_REF = new Date();
    let sanitizedTicketName = formatString(data.ticketTitle),
        ticketNameBlocks = sanitizedTicketName.toLowerCase().split(' ').join('-');
    let TICKET_NAME = `TULEAP-${data.tickets.split(',')[0]}-${ticketNameBlocks}`,
        VERSION_CODE = `${DATE_REF.getFullYear()}.${DATE_REF.getMonth()+1}.${DATE_REF.getDate()}+${data.versionCode}`,
        UPDATES = data.updates,
        TICKETS = [];
        LINKS = "";
    
    data.tickets.split(',').forEach(ticket => {
        TICKETS.push(`TULEAP-${ticket}`);
        LINKS += `https://tuleap.xlayerinfra.com/plugins/tracker/?aid=${ticket}\n`
    });

    return {
        ticketName: TICKET_NAME,
        version: VERSION_CODE,
        updates: UPDATES,
        tickets: TICKETS,
        ticketLinks: LINKS,
        buildUrl: data.buildUrl,
    }

}


function generateCommitMessage(data) {
    return`${data.ticketName}

Version: ${data.version}

### Updates
${data.updates}

Tickets:
${data.tickets}

Ticket Links:
${data.ticketLinks}

Build URL:
${data.buildUrl || 'NA'}
`
}