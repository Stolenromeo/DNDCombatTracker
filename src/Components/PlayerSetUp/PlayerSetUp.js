import React, { Component } from 'react'
import { connect } from 'react-redux'
import { name, health, ac, init, strength, dex, con, wis, intel, cha, changeHealth } from '../../Ducks/player'
import { addCombatant } from '../../Ducks/gm'
import { socketConnect } from 'socket.io-react' 
// import io from 'socket.io-client'


class PlayerSetUp extends Component {
	constructor(){
		super()
		this.state={
			battleId:'',
			lastBattleId:'',
			healthChange:0,
			connected:false
		}
	}

	handleSubmit = (e)=>{
		e.preventDefault();
		let { changeHealth, addCombatant, socket, player, history } = this.props;
		let { name, health, ac/*, room*/ } = player;
		if (name && health && ac /*&& room*/){
			changeHealth(health)
			console.log(player)
			socket.emit('added', player) 
			history.push('/combat')
		} else {
			alert("You must have name, health, and AC values for your character")
		}
	}

	handleId=(e)=>{
		this.setState({
			battleId:e.target.value,
		})
	}

	socket=()=>{
		let {battleId, lastBattleId} = this.state
		let { socket } = this.props
		if(battleId){
			if(battleId !== lastBattleId  && lastBattleId){
				socket.emit('leave', {battle:lastBattleId})
				socket.emit('join', {battle:battleId.toUpperCase()})
			} else{
				socket.emit('join', {battle:battleId.toUpperCase()})
			} 	
			this.setState({
				lastBattleId:battleId
			})
		}
	}
	connect=()=>{
		this.setState({
			connected:!this.state.connected
		})
	}
	
	render(){
		let { socket } = this.props

		socket.on('start', function(/*more than on parameter must be an obj*/){})
		let { name, health, ac, init, strength, dex, con, wis, intel, cha} = this.props;
		return (
			<div>
				{!this.state.connected?<div>
					Connect your battleId first<input value={this.state.battleId} onChange={this.handleId}/>
					<button onClick={()=>{this.socket();this.connect()}}>Connect</button>
				</div>:
				<form onSubmit={this.handleSubmit} name='playerForm' className='playerForm'>
					<input placeholder="Player Name" type='text'
					onChange={(e)=>name(e.target.value)}
					/>
					<br/>	
					<input placeholder="Health" type='number' onChange={(e)=>{health(e.target.value)}}/>	
					<input placeholder="Armor Class" type='number' onChange={(e)=>ac(e.target.value)}/>
					<input placeholder="Initiative Bonus" type='number' onChange={(e)=>init(e.target.value)}/>	
					<br/>	
					<p>Saving Throw Modifiers:</p>
					<input placeholder="Strength" type='number' onChange={(e)=>strength(e.target.value)}/>	
					<input placeholder="Dexterity" type='number' onChange={(e)=>dex(e.target.value)}/>
					<br/>	
					<input placeholder="Constitution" type='number' onChange={(e)=>con(e.target.value)}/>	
					<input placeholder="Wisdom" type='number' onChange={(e)=>wis(e.target.value)}/>	
					<br/>
					<input placeholder="Intelligence" type='number' onChange={(e)=>intel(e.target.value)}/>	
					<input placeholder="Charisma" type='number' onChange={(e)=>cha(e.target.value)}/>	
					<input type='submit' value="Ready?"/>
				</form>
				}
			</div>
		)
	}
}

let mapStateToProps = (state)=>{
	let player = state.player
	return{player
	}
}

export default socketConnect(connect(mapStateToProps,{ name, health, ac, init, strength, dex, con, wis, intel, cha, changeHealth, addCombatant })(PlayerSetUp))

// let styles= {
// 	name: {
// 		width: '300px',
// 		fontSize: '3em',
// 		// margin:'0 auto',
// 		// display:'flex',
// 		// justifyContent:'center'
// 	}
// }