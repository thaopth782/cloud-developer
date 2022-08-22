import { TodoAcess as TodosAccess } from './todosAcess'
import { getUploadUrl } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic

const todosAccess: TodosAccess = new TodosAccess()

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
    return await todosAccess.getAllByUserId(userId) as TodoItem[]
}

export const createTodo = async (userId: string, newTodo: CreateTodoRequest) => {
    const todoId = uuid.v4()

    const todoItem: TodoItem = {
        ...newTodo,
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
    } as TodoItem
    
    return await todosAccess.create(todoItem)
}

export const updateTodo = async (updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string) => {
    return await todosAccess.update(updateTodoRequest, userId, todoId)
}

export const deleteTodo = async (userId: string, todoId: string) => {
    return await todosAccess.delete(userId, todoId)
}

export const createAttachmentPresignedUrl = async (userId: string, todoId: string) => {
    const uploadUrl = getUploadUrl(todoId)

    await todosAccess.updateAttachmentUrl(userId, todoId, uploadUrl.split('?')[0])

    return uploadUrl
}
