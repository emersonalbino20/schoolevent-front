import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function ShowProfileImage(imagem, visivel) {
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  return (
    <>
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Imagens da Actidade: </DialogTitle>
            <DialogDescription>
              Este evento não possui imagens cadastradas
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <img
              src={`http://localhost:3333${imagem?.url}`}
              alt={`Imagem de Perfil `}
              className={
                "w-full h-auto object-cover rounded-md max-h-40 md:max-h-52"
              }
            />
          </div>
          <DialogFooter>
            <DialogClose className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Fechar
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
