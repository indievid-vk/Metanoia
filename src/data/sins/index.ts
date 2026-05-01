import { Sin } from '../../store';
import { gluttonySins } from './1_gluttony';
import { fornicationSins } from './2_fornication';
import { avariceSins } from './3_avarice';
import { angerSins } from './4_anger';
import { sorrowSins } from './5_sorrow';
import { despondencySins } from './6_despondency';
import { vainglorySins } from './7_vainglory';
import { prideSins } from './8_pride';

function formatSins(sins: any[], prefix: string): Sin[] {
  return sins.map((sin, index) => {
    const text = sin.description.charAt(0).toUpperCase() + sin.description.slice(1);
    
    // Try to split into title and description
    // Let's use the first phrase (up to comma, colon, or first 5 words) as title
    let title = text;
    let description = '';
    
    const match = text.match(/^([^,:(]+)([,:(].*)$/);
    if (match && match[1].split(' ').length <= 8) {
      title = match[1].trim();
      description = (match[1] + match[2]).trim(); // Keep full text in description for context
    } else {
      const words = text.split(' ');
      if (words.length > 6) {
        title = words.slice(0, 5).join(' ') + '...';
        description = text;
      } else {
        title = text;
      }
    }

    return {
      id: `${prefix}_${index + 1}`,
      passion: sin.passion,
      title,
      description,
      severity: sin.severity
    };
  });
}

export const ALL_SINS: Sin[] = [
  ...formatSins(gluttonySins, 'glut'),
  ...formatSins(fornicationSins, 'forn'),
  ...formatSins(avariceSins, 'avar'),
  ...formatSins(angerSins, 'ang'),
  ...formatSins(sorrowSins, 'sorr'),
  ...formatSins(despondencySins, 'desp'),
  ...formatSins(vainglorySins, 'vain'),
  ...formatSins(prideSins, 'prid')
];
