

const init = () => {
  let inEditMode = false;

  let offers = []
  let formData = {
    brand: '',
    offer: ''
  }
  let selectedOffer = {
    id: '',
    brand: '',
    offer: ''
  }




  const form = document.getElementById('form')
  const list = document.getElementById('list')


  fetchOffers()



  function renderForm() {

    const formHtml =
      `
      <h4 class='form-title'>Form </h4>
      <label class='form-label' for="brandInput">Brand:</label>
      <input type="text" id="brandInput" class="form-input" name="brand" placeholder="Brand name..." />
      <label class='form-label' for="offerInput">Offer:</label>
     <textarea id="offerInput" class="form-input" name="offer" placeholder="Offer text..." ></textarea>
    <div class='form-btn-menu'>
      <button type="submit" name="submit" class="form-btn">✓ Submit</button> 
      </div>
      `
    form.innerHTML = formHtml

    // Event Listeners
    document.getElementById('brandInput').addEventListener('input', handleFormInput)

    document.getElementById('offerInput').addEventListener('input', handleFormInput)


    form.addEventListener('submit', handleSubmitClick)



  }

  function handleFormInput(e) {
    const { name, value } = e.target
    formData = {
      ...formData,
      [name]: value
    }
  }



  function handleSubmitClick(e) {
    e.preventDefault()
    const { name, value } = e.target
    if (inEditMode) {
      selectedOffer = {
        ...selectedOffer,
        brand: document.getElementById('brandInput').value,
        offer: document.getElementById('offerInput').value,
      }
      const updatedOffer = selectedOffer
      updateOffer(updatedOffer)
    } else {
      const newOffer = formData
      createOffer(newOffer)
    }
  }


  function renderList(data) {
    console.log("Rendering Offers:", data); // ✅ Debugging

    const offerList = data.map(item => (
      `<tr data-id="${item.id}"> 
            <td>${item.id ? item.id : "⚠️ Missing ID"}</td>  <!-- ✅ Show warning if ID is missing -->
            <td>${item.brand}</td>
            <td>${item.offer}</td>
            <td>
                <button type="button" class="item-btn" name="edit" data-id="${item.id}">
                    Edit
                </button>
            </td>
            <td>
                <button type="button" class="item-btn" name="del" data-id="${item.id}">
                    Del
                </button>
            </td>
        </tr>`
    )).join('');

    list.innerHTML = `<table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Brand</th>
                <th>Offer</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>${offerList}</tbody>
    </table>`;
  }


  list.addEventListener('click', handleItemButtonClick)

  function handleItemButtonClick(e) {
    const { name } = e.target;
    const id = e.target.getAttribute("data-id"); // ✅ Get ID from data attribute

    if (!id) {
      console.error("Error: Clicked element has no ID!");
      return;
    }

    const offerObj = offers.find(offer => offer.id === id);

    if (!offerObj) {
      console.error("Offer not found:", id);
      return;
    }

    selectedOffer = offerObj;

    if (name === "del") {
      deleteOffer(id);
    } else if (name === "edit") {
      inEditMode = true;
      selectedOffer = offerObj;

      document.getElementById('brandInput').value = offerObj.brand;
      document.getElementById('offerInput').value = offerObj.offer;
    }
  }



  async function fetchOffers() {
    try {
      const r = await fetch(`https://mini-offer-api.onrender.com/offers`);
      if (!r.ok) {
        throw new Error('bad fetch in GET');
      }
      const data = await r.json();

      // ✅ Ensure every offer has an ID (do NOT generate IDs in frontend)
      offers = data.map(offer => ({
        id: offer.id,  // IDs should always come from backend
        brand: offer.brand,
        offer: offer.offer
      }));

      console.log("Offers fetched:", offers); // ✅ Debugging

      renderList(offers);
      renderForm();
    } catch (error) {
      console.error(error);
    }
  }


  async function createOffer(newOffer) {
    try {
      const r = await fetch(`https://mini-offer-api.onrender.com/offers`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newOffer)
      })
      if (!r.ok) {
        throw new Error('bad fetch in POST')
      }
      await fetchOffers()

    } catch (error) { console.error(error) }
  }

  async function deleteOffer(id) {
    try {
      const r = await fetch(`https://mini-offer-api.onrender.com/offers/${id}`, {
        method: 'DELETE',
      })
      if (!r.ok) {
        throw new Error('bad fetch in DELETE')
      }
      await fetchOffers()

    } catch (error) { console.error(error) }
  }
  async function updateOffer(updatedOffer) {
    try {
      const r = await fetch(`https://mini-offer-api.onrender.com/offers/${updatedOffer.id}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOffer)
      });

      if (!r.ok) {
        throw new Error('bad fetch in PATCH');
      }

      await fetchOffers();
    } catch (error) { console.error(error); }
  }



}

window.addEventListener("DOMContentLoaded", init)