import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {convertFromRaw, convertToRaw, Editor, EditorState, getDefaultKeyBinding, RichUtils,} from 'draft-js';
import {
  blockRenderMap,
  changeDepth,
  extractInlineStyle,
  getCustomStyleMap,
  getSelectedBlocksType,
  handleNewLine,
} from 'draftjs-utils';
import classNames from 'classnames';
import ModalHandler from '../event-handler/modals';
import FocusHandler from '../event-handler/focus';
import KeyDownHandler from '../event-handler/keyDown';
import SuggestionHandler from '../event-handler/suggestions';
import blockStyleFn from '../utils/BlockStyle';
import {mergeRecursive} from '../utils/toolbar';
import {filter, hasProperty} from '../utils/common';
import {handlePastedText} from '../utils/handlePaste';
import Controls from '../controls';
import getBlockRenderFunc from '../renderer';
import defaultToolbar from '../config/defaultToolbar';
import localeTranslations from '../i18n';
import './styles.css';
import '../../css/Draft.css';

class WysiwygEditor extends Component {
  constructor(props) {
    super(props);
    const toolbar = mergeRecursive(defaultToolbar, props.toolbar);
    const wrapperId = props.wrapperId
      ? props.wrapperId
      : Math.floor(Math.random() * 10000);
    this.wrapperId = `rdw-wrapper-${wrapperId}`;
    this.modalHandler = new ModalHandler();
    this.focusHandler = new FocusHandler();
    this.blockRendererFn = getBlockRenderFunc(
      {
        isReadOnly: this.isReadOnly,
        isImageAlignmentEnabled: this.isImageAlignmentEnabled,
        getEditorState: this.getEditorState,
        onChange: this.onChange,
      },
      props.customBlockRenderFunc,
    );
    this.editorProps = this.filterEditorProps(props);
    this.customStyleMap = this.getStyleMap(props);
    const editorState = this.createEditorState();
    extractInlineStyle(editorState);
    this.state = {
      editorState,
      editorFocused: false,
      toolbar,
    };
  }

  componentDidMount() {
    this.modalHandler.init(this.wrapperId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps === this.props) return;
    const newState = {};
    const { editorState, contentState } = this.props;
    if (!this.state.toolbar) {
      newState.toolbar = mergeRecursive(defaultToolbar, toolbar);
    }
    if (
      hasProperty(this.props, 'editorState')
      && editorState !== prevProps.editorState
    ) {
      if (editorState) {
        newState.editorState = EditorState.set(editorState, {});
      } else {
        newState.editorState = EditorState.createEmpty();
      }
    } else if (
      hasProperty(this.props, 'contentState')
      && contentState !== prevProps.contentState
    ) {
      if (contentState) {
        const newEditorState = this.changeEditorState(contentState);
        if (newEditorState) {
          newState.editorState = newEditorState;
        }
      } else {
        newState.editorState = EditorState.createEmpty();
      }
    }
    if (
      prevProps.editorState !== editorState
      || prevProps.contentState !== contentState
    ) {
      extractInlineStyle(newState.editorState);
    }
    if (Object.keys(newState).length) this.setState(newState);
    this.editorProps = this.filterEditorProps(this.props);
    this.customStyleMap = this.getStyleMap(this.props);
  }

  onEditorBlur = () => {
    this.setState({
      editorFocused: false,
    });
  };

  onEditorFocus = (event) => {
    const { onFocus } = this.props;
    this.setState({
      editorFocused: true,
    });
    const editFocused = this.focusHandler.isEditorFocused();
    if (onFocus && editFocused) {
      onFocus(event);
    }
  };

  onEditorMouseDown = () => {
    this.focusHandler.onEditorMouseDown();
  };

  keyBindingFn = (event) => {
    if (event.key === 'Tab') {
      const { onTab } = this.props;
      if (!onTab || !onTab(event)) {
        const editorState = changeDepth(
          this.state.editorState,
          event.shiftKey ? -1 : 1,
          4,
        );
        if (editorState && editorState !== this.state.editorState) {
          this.onChange(editorState);
          event.preventDefault();
        }
      }
      return null;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      if (SuggestionHandler.isOpen()) {
        event.preventDefault();
      }
    }
    return getDefaultKeyBinding(event);
  };

  onToolbarFocus = (event) => {
    const { onFocus } = this.props;
    if (onFocus && this.focusHandler.isToolbarFocused()) {
      onFocus(event);
    }
  };

  onWrapperBlur = (event) => {
    const { onBlur } = this.props;
    if (onBlur && this.focusHandler.isEditorBlur(event)) {
      onBlur(event, this.getEditorState());
    }
  };

  onChange = (editorState) => {
    const { readOnly, onEditorStateChange } = this.props;
    if (
      !readOnly
      && !(
        getSelectedBlocksType(editorState) === 'atomic'
        && editorState.getSelection().isCollapsed
      )
    ) {
      if (onEditorStateChange) {
        onEditorStateChange(editorState, this.props.wrapperId);
      }
      if (!hasProperty(this.props, 'editorState')) {
        this.setState({ editorState }, this.afterChange(editorState));
      } else {
        this.afterChange(editorState);
      }
    }
  };

  setWrapperReference = (ref) => {
    this.wrapper = ref;
  };

  setEditorReference = (ref) => {
    if (this.props.editorRef) {
      this.props.editorRef(ref);
    }
    this.editor = ref;
  };

  getWrapperRef = () => this.wrapper;

  getEditorState = () => (this.state ? this.state.editorState : null);

  getSuggestions = () => this.props.mention && this.props.mention.suggestions;

  afterChange = (editorState) => {
    setTimeout(() => {
      const { onChange, onContentStateChange } = this.props;
      if (onChange) {
        onChange(convertToRaw(editorState.getCurrentContent()));
      }
      if (onContentStateChange) {
        onContentStateChange(convertToRaw(editorState.getCurrentContent()));
      }
    });
  };

  isReadOnly = () => this.props.readOnly;

  isImageAlignmentEnabled = () => this.state.toolbar.image.alignmentEnabled;

  createEditorState = () => {
    let editorState;
    if (hasProperty(this.props, 'editorState')) {
      if (this.props.editorState) {
        editorState = EditorState.set(this.props.editorState, {});
      }
    } else if (hasProperty(this.props, 'defaultEditorState')) {
      if (this.props.defaultEditorState) {
        editorState = EditorState.set(this.props.defaultEditorState, {});
      }
    } else if (hasProperty(this.props, 'contentState')) {
      if (this.props.contentState) {
        const contentState = convertFromRaw(this.props.contentState);
        editorState = EditorState.createWithContent(
          contentState
        );
        editorState = EditorState.moveSelectionToEnd(editorState);
      }
    } else if (
      hasProperty(this.props, 'defaultContentState')
      || hasProperty(this.props, 'initialContentState')
    ) {
      let contentState = this.props.defaultContentState || this.props.initialContentState;
      if (contentState) {
        contentState = convertFromRaw(contentState);
        editorState = EditorState.createWithContent(
          contentState
        );
        editorState = EditorState.moveSelectionToEnd(editorState);
      }
    }
    if (!editorState) {
      editorState = EditorState.createEmpty();
    }
    return editorState;
  };

  filterEditorProps = (props) => filter(props, [
    'onChange',
    'onEditorStateChange',
    'onContentStateChange',
    'initialContentState',
    'defaultContentState',
    'contentState',
    'editorState',
    'defaultEditorState',
    'locale',
    'localization',
    'toolbarOnFocus',
    'toolbar',
    'toolbarCustomButtons',
    'toolbarClassName',
    'editorClassName',
    'toolbarHidden',
    'wrapperClassName',
    'toolbarStyle',
    'editorStyle',
    'wrapperStyle',
    'uploadCallback',
    'onFocus',
    'onBlur',
    'onTab',
    'mention',
    'hashtag',
    'ariaLabel',
    'customBlockRenderFunc',
    'customDecorators',
    'handlePastedText',
    'customStyleMap',
  ]);

  getStyleMap = (props) => ({ ...getCustomStyleMap(), ...props.customStyleMap });

  changeEditorState = (contentState) => {
    const newContentState = convertFromRaw(contentState);
    let { editorState } = this.state;
    editorState = EditorState.push(
      editorState,
      newContentState,
      'insert-characters',
    );
    editorState = EditorState.moveSelectionToEnd(editorState);
    return editorState;
  };

  focusEditor = () => {
    setTimeout(() => {
      this.editor.focus();
    });
  };

  handleKeyCommand = (command) => {
    const {
      editorState,
      toolbar: { inline },
    } = this.state;
    if (inline && inline.options.indexOf(command) >= 0) {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.onChange(newState);
        return true;
      }
    }
    return false;
  };

  handleReturn = (event) => {
    if (SuggestionHandler.isOpen()) {
      return true;
    }
    const { editorState } = this.state;
    const newEditorState = handleNewLine(editorState, event);
    if (newEditorState) {
      this.onChange(newEditorState);
      return true;
    }
    return false;
  };

  handlePastedTextFn = (text, html) => {
    const { editorState } = this.state;
    const {
      handlePastedText: handlePastedTextProp,
      stripPastedStyles,
    } = this.props;

    if (handlePastedTextProp) {
      return handlePastedTextProp(text, html, editorState, this.onChange);
    }
    if (!stripPastedStyles) {
      return handlePastedText(text, html, editorState, this.onChange);
    }
    return false;
  };

  preventDefault = (event) => {
    if (
      event.target.tagName === 'INPUT'
      || event.target.tagName === 'LABEL'
      || event.target.tagName === 'TEXTAREA'
    ) {
      this.focusHandler.onInputMouseDown();
    } else {
      event.preventDefault();
    }
  };

  render() {
    const { editorState, editorFocused, toolbar } = this.state;
    const {
      locale,
      localization: { locale: newLocale, translations },
      toolbarCustomButtons,
      toolbarOnFocus,
      toolbarClassName,
      toolbarHidden,
      editorClassName,
      wrapperClassName,
      toolbarStyle,
      editorStyle,
      wrapperStyle,
      uploadCallback,
      ariaLabel,
    } = this.props;

    const controlProps = {
      modalHandler: this.modalHandler,
      editorState,
      onChange: this.onChange,
      translations: {
        ...localeTranslations[locale || newLocale],
        ...translations,
      },
    };
    const toolbarShow = editorFocused || this.focusHandler.isInputFocused() || !toolbarOnFocus;
    return (
      <div
        id={this.wrapperId}
        className={classNames(wrapperClassName, 'rdw-editor-wrapper')}
        style={wrapperStyle}
        onClick={this.modalHandler.onEditorClick}
        onBlur={this.onWrapperBlur}
        aria-label="rdw-wrapper"
      >
        {!toolbarHidden && (
          <div
            className={classNames('rdw-editor-toolbar', toolbarClassName)}
            style={{
              visibility: toolbarShow ? 'visible' : 'hidden',
              ...toolbarStyle,
            }}
            onMouseDown={this.preventDefault}
            aria-label="rdw-toolbar"
            aria-hidden={(!editorFocused && toolbarOnFocus).toString()}
            onFocus={this.onToolbarFocus}
          >
            {toolbar.options.map((opt, index) => {
              const Control = Controls[opt];
              const config = toolbar[opt];
              if (opt === 'image' && uploadCallback) {
                config.uploadCallback = uploadCallback;
              }
              return <Control key={index} {...controlProps} config={config} />;
            })}
            {toolbarCustomButtons
              && toolbarCustomButtons.map((button, index) => React.cloneElement(button, { key: index, ...controlProps }))}
          </div>
        )}
        <div
          ref={this.setWrapperReference}
          className={classNames(editorClassName, 'rdw-editor-main')}
          style={editorStyle}
          onClick={this.focusEditor}
          onFocus={this.onEditorFocus}
          onBlur={this.onEditorBlur}
          onKeyDown={KeyDownHandler.onKeyDown}
          onMouseDown={this.onEditorMouseDown}
        >
          <Editor
            ref={this.setEditorReference}
            keyBindingFn={this.keyBindingFn}
            editorState={editorState}
            onChange={this.onChange}
            blockStyleFn={blockStyleFn}
            customStyleMap={this.getStyleMap(this.props)}
            handleReturn={this.handleReturn}
            handlePastedText={this.handlePastedTextFn}
            blockRendererFn={this.blockRendererFn}
            handleKeyCommand={this.handleKeyCommand}
            ariaLabel={ariaLabel || 'rdw-editor'}
            blockRenderMap={blockRenderMap}
            {...this.editorProps}
          />
        </div>
      </div>
    );
  }
}

WysiwygEditor.propTypes = {
  onChange: PropTypes.func,
  onEditorStateChange: PropTypes.func,
  onContentStateChange: PropTypes.func,
  // initialContentState is deprecated
  initialContentState: PropTypes.object,
  defaultContentState: PropTypes.object,
  contentState: PropTypes.object,
  editorState: PropTypes.object,
  defaultEditorState: PropTypes.object,
  toolbarOnFocus: PropTypes.bool,
  spellCheck: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  stripPastedStyles: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  toolbar: PropTypes.object,
  toolbarCustomButtons: PropTypes.array,
  toolbarClassName: PropTypes.string,
  toolbarHidden: PropTypes.bool,
  locale: PropTypes.string,
  localization: PropTypes.object,
  editorClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
  toolbarStyle: PropTypes.object,
  editorStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
  uploadCallback: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onTab: PropTypes.func,
  mention: PropTypes.object,
  hashtag: PropTypes.object,
  textAlignment: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  readOnly: PropTypes.bool,
  tabIndex: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  placeholder: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  ariaLabel: PropTypes.string,
  ariaOwneeID: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  ariaActiveDescendantID: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  ariaAutoComplete: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  ariaDescribedBy: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  ariaExpanded: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  ariaHasPopup: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  customBlockRenderFunc: PropTypes.func,
  wrapperId: PropTypes.number,
  customDecorators: PropTypes.array,
  editorRef: PropTypes.func,
  handlePastedText: PropTypes.func,
};

WysiwygEditor.defaultProps = {
  toolbarOnFocus: false,
  toolbarHidden: false,
  stripPastedStyles: false,
  localization: { locale: 'en', translations: {} },
  customDecorators: [],
};

export default WysiwygEditor;
