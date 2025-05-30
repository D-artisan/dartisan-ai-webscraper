// Debug script to test validation logic
const formData = {
  url: 'invalid-url',
  prompt: 'Extract some data from this page',
  outputFormat: 'text',
};

const validateForm = () => {
  const newErrors = {};

  // URL validation
  if (!formData.url.trim()) {
    newErrors.url = 'URL is required';
  } else {
    try {
      const url = new URL(formData.url);
      if (!['http:', 'https:'].includes(url.protocol)) {
        newErrors.url = 'URL must use HTTP or HTTPS protocol';
      }
    } catch {
      newErrors.url = 'Please enter a valid URL';
    }
  }

  // Prompt validation
  if (!formData.prompt.trim()) {
    newErrors.prompt = 'Prompt is required';
  } else if (formData.prompt.trim().length < 10) {
    newErrors.prompt = 'Prompt must be at least 10 characters long';
  }

  console.log('Validation errors:', newErrors);
  return Object.keys(newErrors).length === 0;
};

console.log('Form data:', formData);
console.log('Validation result:', validateForm());
