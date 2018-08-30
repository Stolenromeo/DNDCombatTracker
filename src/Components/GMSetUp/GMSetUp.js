import React, { Component } from 'react'
import CombatantList from '../CombatantList/CombatantList'
import AddEnemies from '../AddEnemies/AddEnemies'
import CustomEnemy from '../CustomEnemy/CustomEnemy'
import { connect } from 'react-redux'
import { dropCombatant, getCombatants, addCombatant } from '../../Ducks/gm'
import { socketConnect } from 'socket.io-react' 
// import io from 'socket.io-client'


class GMSetUp extends Component{
	constructor(){
		super()
		this.state={
			battleId:''
		}
	}

	componentDidMount=()=>{
		let {getCombatants, socket, addCombatant} = this.props
		socket.emit('join')
		let settingState=function(resp){
			this.setState({
				battleId: resp.battle
			})
			getCombatants(this.state.battleId)
		}
		let bound = settingState.bind(this)
		socket.on('battle', bound)
		socket.on('added', function(player){
			addCombatant(player)
		})
	}
	
	render(){
		let {battleId}=this.state
		return(
			<div>
				<h2>Your battle ID is: {battleId}</h2>
				<AddEnemies room={battleId}/>
				<h3>Got a custom enemy?</h3>
				<CustomEnemy room={battleId}/>
				<h2>Combatants</h2>
				{this.props.combatants.length>0?
				this.props.combatants.map((c, i)=>{
					return(	
					<div key={i}>
						<CombatantList combatant={c}/>
						<button onClick={()=>this.props.dropCombatant(c)}>Remove</button>
					</div>
				)
					})
				:<div>No combatants</div>}
			</div>
		)
	}
}

function mapStateToProps(state){
	return {
		combatants: state.gm.combatants
	}
}

export default socketConnect(connect(mapStateToProps, { dropCombatant, getCombatants, addCombatant })(GMSetUp))