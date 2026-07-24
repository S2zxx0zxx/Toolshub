// REAL-TIME TOOLS - Actual execution, not just AI chat
export const RealtimeTools = (() => {

  // REAL-TIME Calculator
  function calculate(expression) {
    try {
      // Clean expression
      let expr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100')
        .replace(/\^/g, '**');
      
      // Safety check - only allow numbers and operators
      if (!/^[\d\s\+\-\*\/\.\(\)]+$/.test(expr)) {
        return { success: false, error: 'Invalid expression' };
      }
      
      const result = Function('"use strict"; return (' + expr + ')')();
      
      return {
        success: true,
        original: expression,
        result: result,
        formatted: typeof result === 'number' ? result.toLocaleString('en-IN') : result
      };
    } catch (e) {
      return { success: false, error: 'Calculation error: ' + e.message };
    }
  }

  // REAL-TIME Word Counter
  function countWords(text) {
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'No text provided' };
    }
    
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words.length / 200); // 200 WPM average
    const speakingTime = Math.ceil(words.length / 130); // 130 WPM average
    
    return {
      success: true,
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime: readingTime + ' min',
      speakingTime: speakingTime + ' min'
    };
  }

  // REAL-TIME Password Generator
  function generatePassword(length = 16, options = {}) {
    const {
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true
    } = options;
    
    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (charset.length === 0) {
      return { success: false, error: 'No character set selected' };
    }
    
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }
    
    return {
      success: true,
      password,
      length,
      strength: length >= 16 ? 'Strong' : length >= 12 ? 'Medium' : 'Weak'
    };
  }

  // REAL-TIME Case Converter
  function convertCase(text, caseType) {
    if (!text) return { success: false, error: 'No text provided' };
    
    const converters = {
      upper: () => text.toUpperCase(),
      lower: () => text.toLowerCase(),
      title: () => text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
      sentence: () => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      camel: () => text.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : ''),
      snake: () => text.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).replace(/^_/, ''),
      kebab: () => text.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, ''),
      constant: () => text.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase().replace(/^_/, '')
    };
    
    const converter = converters[caseType];
    if (!converter) {
      return { success: false, error: 'Invalid case type: ' + caseType };
    }
    
    return {
      success: true,
      original: text,
      converted: converter(),
      caseType
    };
  }

  // REAL-TIME Age Calculator
  function calculateAge(birthDate) {
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      
      if (isNaN(birth.getTime())) {
        return { success: false, error: 'Invalid date format' };
      }
      
      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();
      let days = today.getDate() - birth.getDate();
      
      if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      }
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalHours = totalDays * 24;
      
      return {
        success: true,
        years,
        months,
        days,
        totalDays,
        totalWeeks,
        totalHours,
        nextBirthday: getNextBirthday(birth)
      };
    } catch (e) {
      return { success: false, error: 'Date calculation error' };
    }
  }

  function getNextBirthday(birthDate) {
    const today = new Date();
    const thisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (thisYear < today) {
      thisYear.setFullYear(thisYear.getFullYear() + 1);
    }
    const diff = Math.ceil((thisYear - today) / (1000 * 60 * 60 * 24));
    return diff + ' days';
  }

  // REAL-TIME Unit Converter
  function convertUnit(value, fromUnit, toUnit) {
    const conversions = {
      // Length
      'km-miles': 0.621371,
      'miles-km': 1.60934,
      'm-feet': 3.28084,
      'feet-m': 0.3048,
      'cm-inches': 0.393701,
      'inches-cm': 2.54,
      'mm-inches': 0.0393701,
      
      // Weight
      'kg-lbs': 2.20462,
      'lbs-kg': 0.453592,
      'g-oz': 0.035274,
      'oz-g': 28.3495,
      
      // Temperature
      'celsius-fahrenheit': (v) => (v * 9/5) + 32,
      'fahrenheit-celsius': (v) => (v - 32) * 5/9,
      'celsius-kelvin': (v) => v + 273.15,
      'kelvin-celsius': (v) => v - 273.15,
      
      // Speed
      'kmh-mph': 0.621371,
      'mph-kmh': 1.60934,
      'ms-kmh': 3.6,
      'kmh-ms': 0.277778,
      
      // Data
      'kb-mb': 0.001,
      'mb-gb': 0.001,
      'gb-tb': 0.001,
      'tb-pb': 0.001
    };
    
    const key = `${fromUnit.toLowerCase()}-${toUnit.toLowerCase()}`;
    const conversion = conversions[key];
    
    if (!conversion) {
      return { success: false, error: `Conversion from ${fromUnit} to ${toUnit} not supported` };
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return { success: false, error: 'Invalid value' };
    }
    
    const result = typeof conversion === 'function' ? conversion(numValue) : numValue * conversion;
    
    return {
      success: true,
      original: numValue,
      fromUnit,
      result: Math.round(result * 1000000) / 1000000,
      toUnit
    };
  }

  // REAL-TIME QR Generator (uses qrcodejs)
  function generateQR(text, options = {}) {
    if (!text) return { success: false, error: 'No text provided' };
    
    const container = document.createElement('div');
    container.id = 'qr-temp-' + Date.now();
    document.body.appendChild(container);
    
    try {
      if (typeof QRCode === 'undefined') {
        return { success: false, error: 'QR library not loaded' };
      }
      
      new QRCode(container, {
        text: text,
        width: options.size || 200,
        height: options.size || 200,
        colorDark: options.darkColor || '#000000',
        colorLight: options.lightColor || '#ffffff'
      });
      
      // Wait for QR to render
      setTimeout(() => {
        const img = container.querySelector('img');
        if (img) {
          container.dataset.qrUrl = img.src;
        }
      }, 100);
      
      return {
        success: true,
        text,
        containerId: container.id
      };
    } catch (e) {
      document.body.removeChild(container);
      return { success: false, error: 'QR generation failed' };
    }
  }

  // REAL-TIME Image Compressor
  function compressImage(file, quality = 0.8) {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve({ success: false, error: 'Invalid image file' });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            resolve({
              success: true,
              originalSize: file.size,
              compressedSize: blob.size,
              reduction: Math.round((1 - blob.size / file.size) * 100) + '%',
              blob,
              url: URL.createObjectURL(blob)
            });
          }, 'image/jpeg', quality);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // REAL-TIME Image Format Converter
  function convertImageFormat(file, targetFormat = 'png') {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve({ success: false, error: 'Invalid image file' });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          const mimeType = `image/${targetFormat}`;
          canvas.toBlob((blob) => {
            resolve({
              success: true,
              originalFormat: file.type,
              targetFormat,
              blob,
              url: URL.createObjectURL(blob)
            });
          }, mimeType);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  return {
    calculate,
    countWords,
    generatePassword,
    convertCase,
    calculateAge,
    convertUnit,
    generateQR,
    compressImage,
    convertUnit
  };
})();
