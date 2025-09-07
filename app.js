document.addEventListener("DOMContentLoaded", () => {


 
  const LOCAL_STORAGE_KEY = "jogadoras_db"


  const initialPlayers = [
    {
      nome: "Andressa Alves",
      posicao: "Meio-campo",
      clube: "Corinthians",
      foto: "https://example.com/andressa.jpg",
      gols: 15,
      assistencias: 10,
      jogos: 28,
      favorita: false,
    },
    {
      nome: "Dayana Rodríguez",
      posicao: "Meio-campo",
      clube: "Corinthians",
      foto: "https://example.com/dayana.jpg",
      gols: 5,
      assistencias: 12,
      jogos: 30,
      favorita: false,
    },
    {
      nome: "Mariza",
      posicao: "Zagueira",
      clube: "Corinthians",
      foto: "https://example.com/mariza.jpg",
      gols: 2,
      assistencias: 1,
      jogos: 32,
      favorita: false,
    },
    {
      nome: "Thaís Regina",
      posicao: "Zagueira",
      clube: "Corinthians",
      foto: "https://example.com/thais.jpg",
      gols: 1,
      assistencias: 2,
      jogos: 25,
      favorita: false,
    },
    {
      nome: "Letícia Teles",
      posicao: "Zagueira",
      clube: "Corinthians",
      foto: "https://example.com/leticia.jpg",
      gols: 0,
      assistencias: 0,
      jogos: 18,
      favorita: false,
    },
  ]

  
  const form = document.getElementById("player-form")
  const playerIdInput = document.getElementById("player-id")
  const nameInput = document.getElementById("name")
  const posicaoSelect = document.getElementById("posicao")
  const clubeInput = document.getElementById("clube")
  const fotoInput = document.getElementById("foto")
  const golsInput = document.getElementById("gols")
  const assistenciasInput = document.getElementById("assistencias")
  const jogosInput = document.getElementById("jogos")
  const submitButton = document.getElementById("submit-button")
  const cancelButton = document.getElementById("btn-cancelar")
  const playersListContainer = document.getElementById("players-list")

  
  const getPlayers = () => {
    const players = localStorage.getItem(LOCAL_STORAGE_KEY)
    return players ? JSON.parse(players) : []
  }

  const savePlayers = (players) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(players))
  }

  
  const renderPlayers = () => {
    const players = getPlayers()
    playersListContainer.innerHTML = "" // Limpa a lista antes de renderizar

    if (players.length === 0) {
      playersListContainer.innerHTML = "<p>Nenhuma jogadora cadastrada.</p>"
      return
    }

    players.forEach((player) => {
      const isFavoritaClass = player.favorita ? "favorita" : ""
      const playerCard = `
        <div class="player-card" data-id="${player.id}">
          <img src="${player.foto}" alt="Foto de ${player.nome}">
          <div class="card-info">
            <h3>${player.nome}</h3>
            <p><strong>Posição:</strong> ${player.posicao}</p>
            <p><strong>Clube:</strong> ${player.clube}</p>
            <p><strong>Estatísticas:</strong> ${player.gols} Gols | ${player.assistencias} Assist. | ${player.jogos} Jogos</p>
          </div>
          <div class="card-actions">
            <button class="btn-action btn-edit">✏️ Editar</button>
            <button class="btn-action btn-delete">🗑️ Excluir</button>
            <button class="btn-action btn-favorite ${isFavoritaClass}">⭐ Favoritar</button>
          </div>
        </div>
      `
      playersListContainer.innerHTML += playerCard
    })
  }

  // LÓGICA DO FORMULÁRIO 
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const id = playerIdInput.value
    const nome = nameInput.value.trim()
    const posicao = posicaoSelect.value
    const clube = clubeInput.value.trim()
    const foto = fotoInput.value.trim()
    const gols = parseInt(golsInput.value) || 0 // Garante que seja um número
    const assistencias = parseInt(assistenciasInput.value) || 0
    const jogos = parseInt(jogosInput.value) || 0

    if (!nome || !posicao || !clube || !foto) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    let players = getPlayers()

    if (id) {
      // --- EDIÇÃO (UPDATE) ---
      players = players.map((player) => {
        if (player.id == id) {
          return {
            ...player,
            nome,
            posicao,
            clube,
            foto,
            gols,
            assistencias,
            jogos,
          }
        }
        return player
      })
      alert("Jogadora editada com sucesso!")
    } else {
      // --- CADASTRO (CREATE) ---
      const newPlayer = {
        id: Date.now(),
        nome,
        posicao,
        clube,
        foto,
        gols,
        assistencias,
        jogos,
        favorita: false,
      }
      players.push(newPlayer)
      alert("Jogadora adicionada com sucesso!")
    }

    savePlayers(players)
    clearForm()
    renderPlayers()
  })

  // 6. LÓGICA DOS BOTÕES DOS CARDS (Editar, Excluir, Favoritar)
  playersListContainer.addEventListener("click", (e) => {
    const target = e.target
    const card = target.closest(".player-card")
    if (!card) return

    const id = Number(card.dataset.id)
    let players = getPlayers()

    if (target.classList.contains("btn-delete")) {
      if (confirm("Tem certeza que deseja excluir esta jogadora?")) {
        players = players.filter((player) => player.id !== id)
        savePlayers(players)
        renderPlayers()
        alert("Jogadora removida com sucesso!")
      }
    }

    if (target.classList.contains("btn-edit")) {
      const playerToEdit = players.find((player) => player.id === id)
      if (playerToEdit) {
        populateForm(playerToEdit)
      }
    }

    if (target.classList.contains("btn-favorite")) {
      players = players.map((player) => {
        if (player.id === id) {
          return { ...player, favorita: !player.favorita }
        }
        return player
      })
      savePlayers(players)
      renderPlayers()
    }
  })

  // FUNÇÕES AUXILIARES
  const clearForm = () => {
    form.reset()
    playerIdInput.value = ""
    submitButton.textContent = "Salvar Jogadora"
  }

  const populateForm = (player) => {
    playerIdInput.value = player.id
    nameInput.value = player.nome
    posicaoSelect.value = player.posicao
    clubeInput.value = player.clube
    fotoInput.value = player.foto
    golsInput.value = player.gols
    assistenciasInput.value = player.assistencias
    jogosInput.value = player.jogos
    submitButton.textContent = "Atualizar Jogadora"
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  cancelButton.addEventListener("click", clearForm)

  // INICIALIZAÇÃO DA APLICAÇÃO
  const init = () => {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      savePlayers(initialPlayers)
    }
    renderPlayers()
  }

  init()

})
