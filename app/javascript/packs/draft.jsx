import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, convertFromHTML, ContentState, RichUtils} from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    const defaultMarkup = document.getElementById('post_body').value;
    const blocksFromHTML = convertFromHTML(defaultMarkup);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    this.state = {editorState: EditorState.createWithContent(state)};
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
      <div className='editor'>
        <button type='button' onClick={this._onBoldClick.bind(this)}>Bold</button>
        <button type='button' onClick={this._onItalicClick.bind(this)}>Italic</button>
        <button type='button' onClick={this._onUnderlineClick.bind(this)}>Underline</button>
        <button type='button' onClick={this._onStrikethroughClick.bind(this)}>Delete</button>
        <button type='button' onClick={this._onHeaderTwoClick.bind(this)}>H2</button>
        <button type='button' onClick={this._onHeaderThreeClick.bind(this)}>H3</button>
        <button type='button' onClick={this._onListClick.bind(this)}>List</button>
        <button type='button' onClick={this._onBlockquoteClick.bind(this)}>Blockquote</button>
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('container')
);