import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Editor from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import ImageAdd from './ImageAdd';
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  EditorState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil
} from 'draft-js';

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

class MyEditor extends Component {
  constructor(props) {
    super(props);

    //// HTMLからconvertする方法
    // let defaultMarkup = document.getElementById('post_body').value;
    // let blocksFromHTML = convertFromHTML(defaultMarkup);
    // let state = ContentState.createFromBlockArray(
    //   blocksFromHTML.contentBlocks,
    //   blocksFromHTML.entityMap
    // );
    let val = document.getElementById('post_body').value;
    let state;
    if (val) {
      let jsonObj = JSON.parse(val);
      state = convertFromRaw(jsonObj);
    } else {
      state = ContentState.createFromText('');
    }
    let initial = EditorState.createWithContent(state, new CompositeDecorator(decorators))

    this.state = {
      editorState: initial,
      showURLInput: false,
      urlValue: ''
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.promptForLink = this._promptForLink.bind(this);
    this.onURLChange = (e) => this.setState({urlValue: e.target.value});
    this.confirmLink = this._confirmLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);
  }

  _promptForLink(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url,
      }, () => {
        setTimeout(() => this.refs.url.focus(), 0);
      });
    }
  }

  _confirmLink(e) {
    e.preventDefault();
    const {editorState, urlValue} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ),
      showUrlInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0);
    });
  }

  _onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }

  _removeLink(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _handleChange(editorState) {
    let raw = convertToRaw(editorState.getCurrentContent());
    let json = JSON.stringify(raw);
    document.getElementById('post_body').value = json;

    this.setState({editorState});
  }
  _onBoldClick(e) {
    this._execOnChangeWhenBtnClick(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'), e);
  }
  _onItalicClick(e) {
    this._execOnChangeWhenBtnClick(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'), e);
  }
  _onUnderlineClick(e) {
    this._execOnChangeWhenBtnClick(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'), e);
  }
  _onStrikethroughClick(e) {
    this._execOnChangeWhenBtnClick(RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH'), e);
  }
  _onHeaderTwoClick(e) {
    this._execOnChangeWhenBtnClick(RichUtils.toggleBlockType(this.state.editorState, 'header-two'), e);
  }
  _onHeaderThreeClick(e) {
    this._execOnChangeWhenBtnClick(RichUtils.toggleBlockType(this.state.editorState, 'header-three'), e);
  }
  _onListClick(e) {
    this._execOnChangeWhenBtnClick(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'), e);
  }
  _onBlockquoteClick(e) {
    this._execOnChangeWhenBtnClick(RichUtils.toggleBlockType(this.state.editorState, 'blockquote'), e);
  }

  _execOnChangeWhenBtnClick(editorState, e) {
    this.onChange(editorState);
    e.preventDefault();
  }

  render() {
    let urlInput;
    if (this.state.showURLInput) {
      urlInput =
        <div>
          <input
            onChange={this.onURLChange}
            ref="url"
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onLinkInputKeyDown}
          />
          <button type='button' onMouseDown={this.confirmLink}>
            Confirm
          </button>
        </div>
    }

    return (
      <div className="root">
        <div className="bottons">
          <button type='button' onMouseDown={(e) => {this._onBoldClick(e)}}>Bold</button>
          <button type='button' onMouseDown={(e) => {this._onItalicClick(e)}}>Italic</button>
          <button type='button' onMouseDown={(e) => {this._onUnderlineClick(e)}}>Underline</button>
          <button type='button' onMouseDown={(e) => {this._onStrikethroughClick(e)}}>Delete</button>
          <button type='button' onMouseDown={(e) => {this._onHeaderTwoClick(e)}}>H2</button>
          <button type='button' onMouseDown={(e) => {this._onHeaderThreeClick(e)}}>H3</button>
          <button type='button' onMouseDown={(e) => {this._onListClick(e)}}>List</button>
          <button type='button' onMouseDown={(e) => {this._onBlockquoteClick(e)}}>Blockquote</button>
          <button type='button' onMouseDown={this.promptForLink}>Add Link</button>
          <button type='button' onMouseDown={this.removeLink}>Remove Link</button>
          <ImageAdd
            editorState={this.state.editorState}
            onChange={this.onChange}
            modifier={imagePlugin.addImage}
          />
        </div>
        {urlInput}
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this._handleChange.bind(this)}
            plugins={plugins}
            decorators={decorators}
            placeholder="Tell your story"
            ref="editor"
          />
        </div>
      </div>
    );
  }
}

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>{props.children}</a>
  );
};

function findImageEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'IMAGE'
      );
    },
    callback
  );
}

const Image = (props) => {
  const {
    height,
    src,
    width,
  } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <img src={src} height={height} width={width} />
  );
};

const styles = {
  link: {
    color: '#3b5998',
    textDecoration: 'underline',
  }
};

const decorators = [
  { strategy: findImageEntities, component: Image },
  { strategy: findLinkEntities, component: Link },
];

ReactDOM.render(
  <MyEditor />,
  document.getElementById('draftEditor')
);