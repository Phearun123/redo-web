const elements = document.querySelectorAll('[ms-code-truncate]');
elements.forEach((element) => {
    const charLimit = parseInt(element.getAttribute('ms-code-truncate'));
    // Create a helper function that will recursively traverse the DOM tree
    const traverseNodes = (node, count) => {
        for (let child of node.childNodes) {
            // If the node is a text node, truncate if necessary
            if (child.nodeType === Node.TEXT_NODE) {
                if (count + child.textContent.length > charLimit) {
                    child.textContent = child.textContent.slice(0, charLimit - count) + '...';
                    return count + child.textContent.length;
                }
                count += child.textContent.length;
            }
            // If the node is an element, recurse through its children
            else if (child.nodeType === Node.ELEMENT_NODE) {
                count = traverseNodes(child, count);
            }
        }
        return count;
    }
    // Create a deep clone of the element to work on. This is so that we don't modify the original element
    // until we have completely finished processing.
    const clone = element.cloneNode(true);
    // Traverse and truncate the cloned node
    traverseNodes(clone, 0);
    // Replace the original element with our modified clone
    element.parentNode.replaceChild(clone, element);
});