export function replaceProcessingInstructions(xmlText) {
  return xmlText.replace(/<\?token\s+([^?>]+)\?>/g, (_, attrs) => {
    const attrPairs = attrs
      .trim()
      .split(/\s+/)
      .map(pair => {
        const [key, rawValue] = pair.split('=');
        // Remove quotes around value if present
        const value = rawValue?.replace(/^['"]|['"]$/g, '');
        return `${key}="${value}"`;
      })
      .join(' ');

    return `<token ${attrPairs} />`;
  });
}


export function parseNode(node) {
  const unit = { id: node.getAttribute('id') };

  function parseObject(xmlElement, schema) {
    const result = {};
    for (const [prop, Type] of Object.entries(schema)) {
      if (Type instanceof CArray) {
        // array type
        const arrayElement = xmlElement.querySelector(prop);
        result[prop] = Type.parse(arrayElement);
      } else {
        // single value type
        const childElement = xmlElement.querySelector(prop);
        result[prop] = Type.parse(childElement);
      }
    }
    return result;
  }




  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (child.nodeType !== 1) continue; // Skip text nodes

    const name = child.nodeName;

    if (child.hasAttribute('value')) {
      const val = child.getAttribute('value');

      // Convert numeric strings to number automatically
      unit[name] = isNaN(val) ? val : Number(val);
    } else if (name === 'CardLayouts') {
      unit[name] = { LayoutButtons: [] };
      const buttons = child.getElementsByTagName('LayoutButtons');
      for (let j = 0; j < buttons.length; j++) {
        const btn = buttons[j];
        const buttonData = {};
        for (let k = 0; k < btn.attributes.length; k++) {
          const attr = btn.attributes[k];
          buttonData[attr.name] = isNaN(attr.value) ? attr.value : Number(attr.value);
        }
        unit[name].LayoutButtons.push(buttonData);
      }
    } else if (name === 'GlossaryStrongArray' || name === 'GlossaryWeakArray' || name === 'WeaponArray') {
      if (!unit[name]) unit[name] = [];
      unit[name].push(child.getAttribute('value') || child.getAttribute('Link'));
    }
    // Add other special nested structures as needed
  }

  return unit;
}
