// JavaScript for frontend11 functionality

document.addEventListener('DOMContentLoaded', () => {
  // Handle Report Item form submission
  const reportForm = document.getElementById('reportItemForm');
  if (reportForm) {
    reportForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        name: reportForm.itemName.value.trim(),
        description: reportForm.itemDescription.value.trim(),
        dateLost: reportForm.dateLost.value,
        locationLost: reportForm.locationLost.value.trim(),
      };

      // Basic validation
      if (!formData.name || !formData.description || !formData.dateLost || !formData.locationLost) {
        alert('Please fill in all fields.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Item reported successfully!');
          reportForm.reset();
        } else {
          const errorData = await response.json();
          alert('Error reporting item: ' + (errorData.message || response.statusText));
        }
      } catch (error) {
        alert('Network error: ' + error.message);
      }
    });
  }

  // Load found items dynamically on itemlist.html
  const itemsTableBody = document.querySelector('#foundItemsTable tbody');
  if (itemsTableBody) {
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => {
        itemsTableBody.innerHTML = '';
        data.forEach(item => {
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
      })
      .catch(err => {
        itemsTableBody.innerHTML = '<tr><td colspan="6" class="text-danger">Failed to load items.</td></tr>';
        console.error('Error loading items:', err);
      });
  }
});
