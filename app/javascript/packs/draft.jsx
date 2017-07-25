import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Editor from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import {CompositeDecorator, ContentBlock, ContentState, EditorState, convertFromHTML, convertFromRaw, convertToRaw, RichUtils} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

const imagePlugin = createImagePlugin();

const plugins = [
  imagePlugin,
];

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

    this.state = {editorState: initial};
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }
  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled'
  }
  handleChange(editorState) {
    let raw = convertToRaw(editorState.getCurrentContent());
    let json = JSON.stringify(raw);
    document.getElementById('post_body').value = json;

    this.setState({editorState});
  }
  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  _onItalicClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }
  _onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }
  _onStrikethroughClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH'));
  }
  _onHeaderTwoClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-two'));
  }
  _onHeaderThreeClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-three'));
  }
  _onListClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
  }
  _onBlockquoteClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'blockquote'));
  }

  render() {
    return (
      <div style={styles.root} className='editor'>
        <button type='button' onClick={this._onBoldClick.bind(this)}>Bold</button>
        <button type='button' onClick={this._onItalicClick.bind(this)}>Italic</button>
        <button type='button' onClick={this._onUnderlineClick.bind(this)}>Underline</button>
        <button type='button' onClick={this._onStrikethroughClick.bind(this)}>Delete</button>
        <button type='button' onClick={this._onHeaderTwoClick.bind(this)}>H2</button>
        <button type='button' onClick={this._onHeaderThreeClick.bind(this)}>H3</button>
        <button type='button' onClick={this._onListClick.bind(this)}>List</button>
        <button type='button' onClick={this._onBlockquoteClick.bind(this)}>Blockquote</button>
        <div style={styles.editor}>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.handleChange.bind(this)}
            plugins={plugins}
            decorators={decorators}
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
    <a href={url}>{props.children}</a>
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

const decorators = [
  { strategy: findImageEntities, component: Image },
  { strategy: findLinkEntities, component: Link },
];

const styles = {
  root: {
    fontFamily: '\'Helvetica\', sans-serif',
    padding: 20,
    width: 600,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
};

ReactDOM.render(
  <MyEditor />,
  document.getElementById('draftEditor')
);