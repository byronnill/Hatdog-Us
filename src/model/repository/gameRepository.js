import { db } from '@/firebase'
import firebase from 'firebase'

export default class GameRepository {

  static initGame(id, map) {
    db.ref(`game/${id}`).set({ 
      gameStarted: false,
      cleanCount: 0,
      infectedCount: 0,
      mapConfig: map
    })
  }

  static startGame(id, cleanCount, infectedCount, mapConfig) {
    db.ref(`game/${id}`).set({
      gameStarted: true,
      cleanCount,
      infectedCount,
      mapConfig
    })
  }

  // implicitly decrements infected count
  static incrementCleanInGame(id) {
    db.ref(`game/${id}/cleanCount`).set(firebase.database.ServerValue.increment(1))
    db.ref(`game/${id}/infectedCount`).set(firebase.database.ServerValue.increment(-1))
  }

  // implicitly decrements clean count
  static incrementInfectedInGame(id) {
    db.ref(`game/${id}/infectedCount`).set(firebase.database.ServerValue.increment(1))
    db.ref(`game/${id}/cleanCount`).set(firebase.database.ServerValue.increment(-1))
  }

  static updateTeamCountOnDisconnect(id, isInfected) {
    db.ref(`game/${id}`).onDisconnect().cancel()

    if (isInfected) {
      db.ref(`game/${id}`)
          .onDisconnect()
          .update({infectedCount: firebase.database.ServerValue.increment(-1)})
    }
    else {
      db.ref(`game/${id}`)
          .onDisconnect()
          .update({cleanCount: firebase.database.ServerValue.increment(-1)})
    }
  }
  
}