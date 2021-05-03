const Lead = {
  leads: [],
  leadsPanel: document.getElementById('leads-panel'),
  leadsContainer: document.getElementById('leads-container'),
  leadTargetId: '',

  async get() {
    // Fake leads fetch from API
    console.log('Busca fictícia de leads no DB')
    try {
      this.leads = await [
          {
            "id": 0,
            "name": "Org. Internacionais",
            "stage": 0
          },
          {
            "id": 1,
            "name": "Ind. Farm. LTDA",
            "stage": 1
          },
          {
            "id": 2,
            "name": "Musc. Sound Live Cmp",
            "stage": 0
          }
        ]
      
    } catch (error) {
      console.error(error);
    }
  },

  show() {
    this.leadsContainer.innerHTML = `
    <div class="leads-row">
      <span class="lead">Clientes em Potencial</span>
      <span class="lead">Dados Confirmados</span>
      <span class="lead">Reunião Agendada</span>
    </div>
    `

    // Populates the rows with each Lead in its current stage
    this.leads.forEach(lead => {
      // A Lead cannot go back to a previous stage (now empty),
      // nor go straight to one (still empty)
      const emptyStage = `
        <span class="lead">
        </span>
      `
      // A Lead must be draggable to its next stage
      const currentStage = `
      <span class="lead">
        <span ondragstart="Lead.dragStart(event)" draggable="true" id="lead-${lead.id}">
          ${lead.name}
        </span>
      </span>
      `
      // A Lead cannot leave its last stage unless it's deleted
      // TODO: Lead.delete(id) and/or Lead.edit(id)
      const nextStage = `
        <span class="lead lead-${lead.id}" ondrop="Lead.drop(event)" ondragover="Lead.allowDrop(event)">
        </span>
      `

      this.leadsContainer.innerHTML += `
      <div class="leads-row">${
        lead.stage === 0 
          ? currentStage + nextStage + emptyStage
          : lead.stage === 1
            ? emptyStage + currentStage + nextStage
            : emptyStage + emptyStage + currentStage
        }
      </div>
      `
    })

  },

  create({name, phone, email}) {
    const newId = Lead.leads.length
    Lead.leads.push(
      {
        "id": newId,
        "name": name,
        "stage": 0,
        "contact": {
          "phone": phone,
          "email": email
        }
      },
    )
    
    setTimeout(() => {
      alert('Lead incluído com sucesso!')
      console.log(this.leads)
    }, 1000)

  },

  nextStage(id) {
    this.leads[id].stage += 1

    this.show()
  },

  dragStart(event) {
    Lead.leadTargetId = event.target.id
  },
  
  allowDrop(event) {
    event.preventDefault()
  },
  
  drop(event) {
    event.preventDefault()

    let leadId = Lead.leadTargetId
    let [ , stageTarget] = event.target.classList

    if (leadId === stageTarget) {
      Lead.leadTargetId = ''

      let id = leadId.replace('lead-','')
      Lead.nextStage(id)
    }
  },
}

const NewLead = {
  headerTitle: 'Novo Lead',
  container: document.getElementById('new-lead'),
  form: document.getElementById('new-lead'),

  contactFields: Array.from(document.getElementsByClassName('contact')),
  checkboxes: Array.from(document.getElementsByClassName('opportunity')),
  otherOpportunity: document.getElementById('other'),

  save() {
    const name = NewLead.contactFields[0].value
    const phone = NewLead.contactFields[1].value
    const email = NewLead.contactFields[2].value

    // const opportunities = {}
    // NewLead.checkboxes.forEach(checkbox => {
    //   opportunities.push(checkbox.checked)
    // })

    Lead.create({
      name,
      phone,
      email
      // opportunities
    })

  },

  cancel() {
    this.checkboxes.forEach(checkbox => checkbox.checked = false)
    this.contactFields.forEach(field => field.value = '')
    this.otherOpportunity.value = ''

    Panel.toggleForm()
  },

  toggleAll(source) {
    this.checkboxes.forEach(checkbox => {
      checkbox.checked = source.checked
    })
  }
}

const Panel = {
  headerTitle: 'Painel de Leads',
  headerContainer: document.getElementById('header-title'),
  container: document.getElementById('leads-panel'),

  async init() {
    await Lead.get()
    Lead.show()
  },

  toggleForm() {
    Panel.container.classList.toggle('inactive')
    NewLead.container.classList.toggle('inactive')[0]

    Panel.headerContainer.innerHTML = Panel.headerContainer.innerHTML == Panel.headerTitle 
      ? NewLead.headerTitle
      : Panel.headerTitle
  }
}

Panel.init()

