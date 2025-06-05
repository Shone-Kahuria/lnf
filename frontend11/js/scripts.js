document.addEventListener('DOMContentLoaded', () => {
  // Handle Report Item form submission
  const reportForm = document.getElementById('reportItemForm');
  const formFeedback = document.getElementById('formFeedback');
  const contactForm = document.getElementById('contactForm');
  const contactFormFeedback = document.getElementById('contactFormFeedback');

  if (reportForm) {
    // Bootstrap custom validation
    reportForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!reportForm.checkValidity()) {
        reportForm.classList.add('was-validated');
        return;
      }

      const formData = {
        name: reportForm.itemName.value.trim(),
        description: reportForm.itemDescription.value.trim(),
        dateLost: reportForm.dateLost.value,
        locationLost: reportForm.locationLost.value.trim(),
      };

      formFeedback.textContent = '';
      formFeedback.className = '';

      try {
        const response = await fetch('http://localhost:5000/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          formFeedback.textContent = 'Item reported successfully!';
          formFeedback.className = 'text-success';
          reportForm.reset();
          reportForm.classList.remove('was-validated');
        } else {
          const errorData = await response.json();
          formFeedback.textContent = 'Error reporting item: ' + (errorData.message || response.statusText);
          formFeedback.className = 'text-danger';
        }
      } catch (error) {
        formFeedback.textContent = 'Network error: ' + error.message;
        formFeedback.className = 'text-danger';
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }

      const contactData = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        message: document.getElementById('contactMessage').value.trim(),
      };

      contactFormFeedback.textContent = '';
      contactFormFeedback.className = '';

      try {
        // For demo, just simulate success after delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        contactFormFeedback.textContent = 'Message sent successfully!';
        contactFormFeedback.className = 'text-success';
        contactForm.reset();
        contactForm.classList.remove('was-validated');
      } catch (error) {
        contactFormFeedback.textContent = 'Failed to send message: ' + error.message;
        contactFormFeedback.className = 'text-danger';
      }
    });
  }

  // Load found items dynamically on itemlist.html
  const itemsTableBody = document.querySelector('#foundItemsTable tbody');
  const loadingMessage = document.getElementById('loadingMessage');
  const errorMessage = document.getElementById('errorMessage');
  const searchInput = document.getElementById('searchInput');

  let itemsData = [];

  async function loadItems() {
    if (!itemsTableBody) return;

    loadingMessage.classList.remove('visually-hidden');
    errorMessage.classList.add('visually-hidden');
    itemsTableBody.innerHTML = '';

    try {
      const res = await fetch('http://localhost:5000/api/items');
      if (!res.ok) throw new Error(res.statusText);
      itemsData = await res.json();
      renderItems(itemsData);
      loadingMessage.classList.add('visually-hidden');
    } catch (err) {
      loadingMessage.classList.add('visually-hidden');
      errorMessage.textContent = 'Failed to load items: ' + err.message;
      errorMessage.classList.remove('visually-hidden');
      console.error('Error loading items:', err);
    }
  }

  function renderItems(items) {
    itemsTableBody.innerHTML = '';
    if (items.length === 0) {
      itemsTableBody.innerHTML = '<tr><td colspan="6" class="text-warning text-center">No items found.</td></tr>';
      return;
    }
    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${item.dateFound || ''}</td>
        <td>${item.locationFound || ''}</td>
        <td>${item.status || 'Available'}</td>
      `;
      itemsTableBody.appendChild(tr);
    });
  }

  function filterItems(query) {
    const filtered = itemsData.filter(item => {
      const q = query.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.locationFound && item.locationFound.toLowerCase().includes(q))
      );
    });
    renderItems(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterItems(e.target.value);
    });
  }

  loadItems();
});
