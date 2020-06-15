const UsersService = {
    getById(knex,id){
        return knex
            .from('tour_users')
            .select('*')
            .where('id',id)
            .first()
    },
}

module.exports = UsersService;