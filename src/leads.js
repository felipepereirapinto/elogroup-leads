const Lead = {
  leads: [],
  leadsContainer: document.getElementById('leads-container'),
  dropAttributes: 'ondrop="Lead.drop(event)" ondragover="Lead.allowDrop(event)"',

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

  create() {
    alert('Open modal')
  },

  nextStage(id) {
    this.leads[id].stage += 1

    this.show()
  },

  dragStart(event) {
    event.dataTransfer.setData("Text", event.target.id)
  },
  
  // dragging(event) {
  //   document.getElementById("demo").innerHTML = "The p element is being dragged";
  // },
  
  allowDrop(event) {
    event.preventDefault()
  },
  
  drop(event) {
    event.preventDefault()

    let leadId = event.dataTransfer.getData("Text")
    let [ , stageTarget] = event.target.classList

    if (leadId == stageTarget) {
      // this.nextStage(leadId.replace('lead-',''))
      event.target.appendChild(document.getElementById(leadId))
      event.dataTransfer.clearData()

      let id = leadId.replace('lead-','')
      Lead.nextStage(id)
    }
  },
}

const Panel = {
  async init() {
    await Lead.get()
    Lead.show()
  }
}

Panel.init()