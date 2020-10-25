import bold from '../../images/bold.svg';
import italic from '../../images/italic.svg';
import underline from '../../images/underline.svg';
import strikethrough from '../../images/strikethrough.svg';
import monospace from '../../images/monospace.svg';
import fontSize from '../../images/font-size.svg';
import indent from '../../images/indent.svg';
import outdent from '../../images/outdent.svg';
import ordered from '../../images/list-ordered.svg';
import unordered from '../../images/list-unordered.svg';
import left from '../../images/align-left.svg';
import center from '../../images/align-center.svg';
import right from '../../images/align-right.svg';
import justify from '../../images/align-justify.svg';
import color from '../../images/color.svg';
import eraser from '../../images/eraser.svg';
import link from '../../images/link.svg';
import unlink from '../../images/unlink.svg';
import emoji from '../../images/emoji.svg';
import embedded from '../../images/embedded.svg';
import image from '../../images/image.svg';
import undo from '../../images/undo.svg';
import redo from '../../images/redo.svg';
import subscript from '../../images/subscript.svg';
import superscript from '../../images/superscript.svg';

/**
* This is default toolbar configuration,
* whatever user passes in toolbar property is deeply merged with this to over-ride defaults.
*/
export default {
  options: [
    "inline",
    "blockType",
    "fontSize",
    "fontFamily",
    "list",
    "textAlign",
    "colorPicker",
    "link",
    "embedded",
    "emoji",
    "image",
    "remove",
    "history"
  ],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "monospace",
      "superscript",
      "subscript"
    ],
    bold: { icon: bold, className: undefined, title: undefined },
    italic: { icon: italic, className: undefined, title: undefined },
    underline: { icon: underline, className: undefined, title: undefined },
    strikethrough: {
      icon: strikethrough,
      className: undefined,
      title: undefined
    },
    monospace: { icon: monospace, className: undefined, title: undefined },
    superscript: { icon: superscript, className: undefined, title: undefined },
    subscript: { icon: subscript, className: undefined, title: undefined }
  },
  blockType: {
    inDropdown: true,
    options: [
      "Normal",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "Blockquote",
      "Code"
    ],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    title: undefined
  },
  fontSize: {
    icon: fontSize,
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    title: undefined
  },
  fontFamily: {
    options: [
      "Arial",
      "Georgia",
      "Impact",
      "Tahoma",
      "Times New Roman",
      "Verdana"
    ],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    title: undefined
  },
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["unordered", "ordered", "indent", "outdent"],
    unordered: { icon: unordered, className: undefined, title: undefined },
    ordered: { icon: ordered, className: undefined, title: undefined },
    indent: { icon: indent, className: undefined, title: undefined },
    outdent: { icon: outdent, className: undefined, title: undefined },
    title: undefined
  },
  textAlign: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["left", "center", "right", "justify"],
    left: { icon: left, className: undefined, title: undefined },
    center: { icon: center, className: undefined, title: undefined },
    right: { icon: right, className: undefined, title: undefined },
    justify: { icon: justify, className: undefined, title: undefined },
    title: undefined
  },
  colorPicker: {
    icon: color,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    colors: [],
    title: undefined
  },
  link: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    dropdownClassName: undefined,
    showOpenOptionOnHover: true,
    defaultTargetOption: "_self",
    options: ["link", "unlink"],
    link: { icon: link, className: undefined, title: undefined },
    unlink: { icon: unlink, className: undefined, title: undefined },
    linkCallback: undefined
  },
  emoji: {
    icon: emoji,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    emojis: [],
    title: undefined
  },
  embedded: {
    icon: embedded,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    embedCallback: undefined,
    defaultSize: {
      height: "auto",
      width: "auto"
    },
    title: undefined
  },
  image: {
    icon: image,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    urlEnabled: true,
    uploadEnabled: true,
    previewImage: false,
    alignmentEnabled: true,
    uploadCallback: undefined,
    inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
    alt: { present: false, mandatory: false },
    defaultSize: {
      height: "auto",
      width: "auto"
    },
    title: undefined
  },
  remove: {
    icon: eraser,
    className: undefined,
    component: undefined,
    title: undefined
  },
  history: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["undo", "redo"],
    undo: { icon: undo, className: undefined, title: undefined },
    redo: { icon: redo, className: undefined, title: undefined },
    title: undefined
  }
};

/**
 * - add option property to color-picker, emoji.
 */
