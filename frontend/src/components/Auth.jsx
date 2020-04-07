import React from 'react'


export default class Auth extends React.Component {
  componentWillMount() {
    VK.init({apiId: 7331709});
  }

  componentDidMount() {
    VK.Widgets.Auth("vk_auth", {
      "onAuth": function(data) {
        alert('user '+data['uid']+' authorized');
      }
    });
  }
  render() {
    return (
      <div id="vk_auth"></div>
    )
  }
}