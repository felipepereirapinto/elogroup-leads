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
      console.log(this.leads)
      
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

    this.leads.forEach(lead => {
      let draggableLead = `
      <span 
        ondragstart="Lead.dragStart(event)"
        draggable="true"
        id="dragtarget"
      >
        ${lead.name}
      </span>
      `
      
      this.leadsContainer.innerHTML += `
        <div class="leads-row">
          <span class="lead">
            ${lead.stage == 0 ? draggableLead : ''}
          </span>

          <span class="lead" ${lead.stage == 0 ? this.dropAttributes : ''}>
            ${lead.stage == 1 ? draggableLead : ''}
          </span>

          <span class="lead" ${lead.stage == 1 ? this.dropAttributes : ''}>
            ${lead.stage == 2 ? draggableLead : ''}
          </span>
        </div>
        `
    })

  },

  create() {
    alert('Open modal')
  },

  dragStart(event) {
    event.dataTransfer.setData("Text", event.target.id);
  },
  
  // dragging(event) {
  //   document.getElementById("demo").innerHTML = "The p element is being dragged";
  // },
  
  allowDrop(event) {
    event.preventDefault();
  },
  
  drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("Text");
    event.target.appendChild(document.getElementById(data));
  },
}

const Panel = {
  async init() {
    await Lead.get()
    Lead.show()
  }
}

Panel.init()