# React Draft Wysiwyg

## /!\ WARNING
This is a fork with only the required elements we use at Doky.
You shouldn't use this fork for your own use, because the available features are very limited !

This fork also includes this [fix](https://github.com/jpuri/react-draft-wysiwyg/pull/816/files).

## END WARNING

A Wysiwyg editor built using ReactJS and DraftJS libraries.
[Demo Page](https://jpuri.github.io/react-draft-wysiwyg).

## Installing
The package can be installed from npm `react-draft-wysiwyg`

```
$ npm install --save react-draft-wysiwyg draft-js
```

## Getting started
Editor can be used as simple React Component:
```js
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
<Editor
  editorState={editorState}
  toolbarClassName="toolbarClassName"
  wrapperClassName="wrapperClassName"
  editorClassName="editorClassName"
  onEditorStateChange={this.onEditorStateChange}
/>
```

## Docs
For more documentation check [here](https://jpuri.github.io/react-draft-wysiwyg/#/docs?_k=jjqinp).

## Questions Discussions
For discussions join public channel #rd_wysiwyg in [DraftJS Slack Organization](https://draftjs.herokuapp.com/).

## Thanks
Original motivation and sponsorship for this work came from [iPaoo](http://www.ipaoo.com/). I am thankful to them for allowing the Editor to be open-sourced.

## License
MIT.
